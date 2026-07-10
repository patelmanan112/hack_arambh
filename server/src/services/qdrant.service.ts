import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

const COLLECTION_NAME = 'recall_iq_chunks';

export const initQdrant = async () => {
  try {
    const response = await client.getCollections();
    const exists = response.collections.some(c => c.name === COLLECTION_NAME);
    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 768, // text-embedding-004 size
          distance: 'Cosine',
        },
      });
      console.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error('Qdrant init error:', error);
  }
};

export const searchChunks = async (workspaceId: string, embedding: number[], limit = 5) => {
  try {
    const results = await client.search(COLLECTION_NAME, {
      vector: embedding,
      limit,
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
    console.error('Qdrant search error:', error);
    return [];
  }
};
