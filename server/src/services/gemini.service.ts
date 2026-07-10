import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

export const streamCascadeFlow = async (prompt: string, onChunk: (text: string) => void) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('Error streaming completion:', error);
    onChunk("Sorry, I encountered an error while processing your request.");
  }
};
