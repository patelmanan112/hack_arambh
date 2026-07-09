import mongoose, { Document, Schema } from 'mongoose';

export interface IRepositoryDocument extends Document {
  repositoryId: mongoose.Types.ObjectId;
  type: string; // e.g., 'README'
  originalContent: string;
  cleanText: string;
  createdAt: Date;
  updatedAt: Date;
}

const RepositoryDocumentSchema: Schema = new Schema({
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  type: { type: String, required: true },
  originalContent: { type: String, required: true },
  cleanText: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IRepositoryDocument>('RepositoryDocument', RepositoryDocumentSchema);
