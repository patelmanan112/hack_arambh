import mongoose, { Document, Schema } from 'mongoose';

export interface IPullRequest extends Document {
  repositoryId: mongoose.Types.ObjectId;
  prNumber: number;
  title: string;
  description?: string;
  author: string;
  labels: string[];
  commentsCount: number;
  mergedDate?: Date;
  state: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const PullRequestSchema: Schema = new Schema({
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  prNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String, required: true },
  labels: [{ type: String }],
  commentsCount: { type: Number, default: 0 },
  mergedDate: { type: Date },
  state: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IPullRequest>('PullRequest', PullRequestSchema);
