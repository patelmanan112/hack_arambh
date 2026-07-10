import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { QdrantClient } from '@qdrant/js-client-rest';
import mongoose from 'mongoose';

const qdrantUrl = (new URL(process.env.QDRANT_URL || 'http://localhost:6333')).toString().replace(/\/$/, '');
const client = new QdrantClient({ url: qdrantUrl, apiKey: process.env.QDRANT_API_KEY, timeout: 30000 });

try {
  const stats = await client.getCollection('recall_iq_chunks');
  console.log('Qdrant collection stats', { indexed_vectors_count: stats.indexed_vectors_count, points_count: stats.points_count });
} catch (err) {
  console.error('Qdrant check failed', err?.message || err);
}

if (!process.env.MONGODB_URI) {
  console.log('No MONGODB_URI');
  process.exit(0);
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'recall_iq' });
const Workspace = mongoose.model('Workspace', new mongoose.Schema({}, { strict: false, collection: 'workspaces' }));
const workspaceDocs = await Workspace.find().limit(5).lean();
console.log('workspaces:', workspaceDocs.map(w => ({ _id: w._id?.toString(), name: w.name, ownerId: w.ownerId })));
const Conversation = mongoose.model('Conversation', new mongoose.Schema({}, { strict: false, collection: 'conversations' }));
const conversations = await Conversation.find().limit(3).lean();
console.log('conversations sample:', conversations.map(c => ({ _id: c._id?.toString(), workspaceId: c.workspaceId, messages: c.messages?.length })));
await mongoose.disconnect();
