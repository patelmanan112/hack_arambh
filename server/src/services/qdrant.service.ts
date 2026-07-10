import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
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

export const initQdrant = async (): Promise<boolean> => {
  try {
    const response = await client.getCollections();
    const exists = response.collections.some(c => c.name === COLLECTION_NAME);
    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log(`[Qdrant] Created collection: ${COLLECTION_NAME}`);
    } else {
      console.log(`[Qdrant] Collection exists: ${COLLECTION_NAME}`);
    }
    return true;
  } catch (error) {
    console.error('[Qdrant] init error:', error);
    return false;
  }
};

export const upsertChunks = async (chunks: QdrantChunk[]): Promise<void> => {
  if (chunks.length === 0) return;

  const points = chunks.map(chunk => ({
    id: chunk.id,
    vector: chunk.vector,
    payload: chunk.payload,
  }));

  // Upsert in batches of 100 to avoid payload size limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < points.length; i += BATCH_SIZE) {
    const batch = points.slice(i, i + BATCH_SIZE);
    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points: batch,
    });
    console.log(`[Qdrant] Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(points.length / BATCH_SIZE)}`);
  }
};

export const deleteWorkspaceChunks = async (workspaceId: string): Promise<void> => {
  try {
    await client.delete(COLLECTION_NAME, {
      filter: {
        must: [
          { key: 'workspaceId', match: { value: workspaceId } }
        ]
      }
    });
    console.log(`[Qdrant] Deleted chunks for workspace: ${workspaceId}`);
  } catch (error) {
    console.error('[Qdrant] delete error:', error);
  }
};

export const searchChunks = async (workspaceId: string, embedding: number[], limit = 5) => {
  try {
    const results = await client.search(COLLECTION_NAME, {
      vector: embedding,
      limit,
      with_payload: true,
      filter: {
        must: [
          {
            key: 'workspaceId',
            match: { value: workspaceId }
          }
        ]
      }
    });
    return results;
  } catch (error) {
    console.error('[Qdrant] search error:', error);
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
