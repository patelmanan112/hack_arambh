import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text.substring(0, 8000)); // max 8k chars
  return result.embedding.values;
};

/**
 * Generate embeddings for multiple texts with rate-limit-safe batching.
 * Gemini embedding API: ~300 RPM free tier → 200ms delay between each request.
 */
export const generateEmbeddingsBatch = async (
  texts: string[],
  onProgress?: (done: number, total: number) => void
): Promise<number[][]> => {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const embedding = await generateEmbedding(texts[i]);
      embeddings.push(embedding);
      onProgress?.(i + 1, texts.length);
      // 250ms between calls to stay within rate limits
      if (i < texts.length - 1) await delay(250);
    } catch (error: any) {
      console.error(`[Gemini] Embedding error at index ${i}:`, error.message);
      // If rate limited, wait 5 seconds and retry once
      if (error.status === 429) {
        console.log('[Gemini] Rate limited, waiting 5s...');
        await delay(5000);
        try {
          const embedding = await generateEmbedding(texts[i]);
          embeddings.push(embedding);
        } catch {
          embeddings.push(new Array(768).fill(0)); // zero vector fallback
        }
      } else {
        embeddings.push(new Array(768).fill(0)); // zero vector fallback
      }
    }
  }

  return embeddings;
};

/**
 * CascadeFlow: Streams answer from Gemini with full RAG prompt.
 * Named cascadeflow as it cascades through: embedding → search → prompt → stream.
 */
export const streamCascadeFlow = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<{ model: string; latency: number }> => {
  const startTime = Date.now();
  const modelName = 'gemini-2.0-flash-exp';

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) onChunk(chunkText);
    }

    return { model: modelName, latency: Date.now() - startTime };
  } catch (error: any) {
    console.error('[CascadeFlow] Streaming error:', error.message);
    onChunk("I couldn't find enough information in your connected engineering knowledge.");
    return { model: modelName, latency: Date.now() - startTime };
  }
};
