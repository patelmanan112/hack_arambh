import mongoose, { Document, Schema } from 'mongoose';

export interface ICommit extends Document {
  repositoryId: mongoose.Types.ObjectId;
  commitMessage: string;
  author: string;
  date: Date;
  branch: string;
  sha: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommitSchema: Schema = new Schema({
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  commitMessage: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  branch: { type: String, required: true },
  sha: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ICommit>('Commit', CommitSchema);
