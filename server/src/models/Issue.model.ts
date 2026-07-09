import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  repositoryId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  commentsCount: number;
  labels: string[];
  status: string;
  assignee?: string;
  createdDate: Date;
  closedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema: Schema = new Schema({
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  title: { type: String, required: true },
  description: { type: String },
  commentsCount: { type: Number, default: 0 },
  labels: [{ type: String }],
  status: { type: String, required: true },
  assignee: { type: String },
  createdDate: { type: Date, required: true },
  closedDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IIssue>('Issue', IssueSchema);
