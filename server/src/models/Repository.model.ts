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
  language?: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  contributorsCount: number;
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
  language: { type: String },
  stargazersCount: { type: Number, default: 0 },
  forksCount: { type: Number, default: 0 },
  openIssuesCount: { type: Number, default: 0 },
  contributorsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IRepository>('Repository', RepositorySchema);
