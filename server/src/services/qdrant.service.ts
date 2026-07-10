import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config();

// Qdrant Cloud needs port 6333 explicitly
function buildQdrantUrl(): string {
  const raw = process.env.QDRANT_URL || 'http://localhost:6333';
  try {
    const url = new URL(raw);
    // Add default port if missing for cloud instances
    if (!url.port) {
      url.port = '6333';
    }
    return url.toString().replace(/\/$/, ''); // remove trailing slash
  } catch {
    return raw;
  }
}

const qdrantUrl = buildQdrantUrl();
console.log(`[Qdrant] Connecting to: ${qdrantUrl}`);

const client = new QdrantClient({
  url: qdrantUrl,
  apiKey: process.env.QDRANT_API_KEY,
  timeout: 30000, // 30s timeout
});

const COLLECTION_NAME = 'recall_iq_chunks';
const VECTOR_SIZE = 768; // text-embedding-004

export interface QdrantChunk {
  id: string;
  vector: number[];
  payload: {
    text: string;
    source: string;
    sourceType: 'README' | 'PR' | 'Commit' | 'Issue' | 'Contributor' | 'Repository';
    workspaceId: string;
    repositoryId: string;
    repositoryName: string;
    url?: string;
    author?: string;
    date?: string;
  };
}

/** Retry wrapper for Qdrant operations */
async function withRetry<T>(fn: () => Promise<T>, label: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      console.error(`[Qdrant] ${label} attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) throw error;
      // Exponential backoff: 2s, 4s, 8s
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error(`[Qdrant] ${label} failed after ${retries} retries`);
}

export const initQdrant = async (): Promise<boolean> => {
  try {
    const response = await withRetry(() => client.getCollections(), 'getCollections', 2);
    const exists = response.collections.some(c => c.name === COLLECTION_NAME);
    if (!exists) {
      await withRetry(() => client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      }), 'createCollection');
      console.log(`[Qdrant] Created collection: ${COLLECTION_NAME}`);
    } else {
      console.log(`[Qdrant] Collection exists: ${COLLECTION_NAME}`);
    }
    return true;
  } catch (error: any) {
    console.error('[Qdrant] Init error (non-fatal):', error.message);
    return false;
  }
};

export const ensureCollection = async (): Promise<void> => {
  try {
    const response = await client.getCollections();
    const exists = response.collections.some(c => c.name === COLLECTION_NAME);
    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
      });
    }
  } catch (err: any) {
    console.error('[Qdrant] ensureCollection error:', err.message);
  }
};

export const upsertChunks = async (chunks: QdrantChunk[]): Promise<void> => {
  if (chunks.length === 0) return;

  // Ensure collection exists before upserting
  await ensureCollection();

  const points = chunks.map(chunk => ({
    id: chunk.id,
    vector: chunk.vector,
    payload: chunk.payload,
  }));

  // Upsert in small batches to avoid payload size limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < points.length; i += BATCH_SIZE) {
    const batch = points.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(points.length / BATCH_SIZE);

    await withRetry(
      () => client.upsert(COLLECTION_NAME, { wait: true, points: batch }),
      `upsertBatch ${batchNum}/${totalBatches}`
    );

    console.log(`[Qdrant] Upserted batch ${batchNum}/${totalBatches} (${batch.length} points)`);
  }
};

export const deleteWorkspaceChunks = async (workspaceId: string): Promise<void> => {
  try {
    await ensureCollection();
    await client.delete(COLLECTION_NAME, {
      filter: {
        must: [{ key: 'workspaceId', match: { value: workspaceId } }]
      }
    });
    console.log(`[Qdrant] Deleted old chunks for workspace: ${workspaceId}`);
  } catch (error: any) {
    // Non-fatal: if delete fails, upsert will still work (duplicates are okay)
    console.warn('[Qdrant] Delete old chunks failed (non-fatal):', error.message);
  }
};

export const searchChunks = async (workspaceId: string, embedding: number[], limit = 5) => {
  try {
    const results = await withRetry(
      () => client.search(COLLECTION_NAME, {
        vector: embedding,
        limit,
        with_payload: true,
        filter: {
          must: [{ key: 'workspaceId', match: { value: workspaceId } }]
        }
      }),
      'searchChunks'
    );
    return results;
  } catch (error: any) {
    console.error('[Qdrant] Search error:', error.message);
    return [];
  }
};

export const getCollectionStats = async () => {
  try {
    const info = await client.getCollection(COLLECTION_NAME);
    return {
      vectorCount: info.indexed_vectors_count ?? 0,
      pointCount: info.points_count ?? 0,
    };
  } catch {
    return { vectorCount: 0, pointCount: 0 };
  }
};
