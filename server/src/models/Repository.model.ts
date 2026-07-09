import mongoose, { Document, Schema } from 'mongoose';

export interface IRepository extends Document {
  githubId: number;
  name: string;
  fullName: string;
  owner: string;
  workspaceId: mongoose.Types.ObjectId;
  url: string;
  description?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RepositorySchema: Schema = new Schema({
  githubId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  owner: { type: String, required: true },
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  url: { type: String, required: true },
  description: { type: String },
  isPrivate: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IRepository>('Repository', RepositorySchema);
