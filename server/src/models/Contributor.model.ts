import mongoose, { Document, Schema } from 'mongoose';

export interface IContributor extends Document {
  repositoryId: mongoose.Types.ObjectId;
  githubUsername: string;
  avatar: string;
  commitsCount: number;
  prCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContributorSchema: Schema = new Schema({
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  githubUsername: { type: String, required: true },
  avatar: { type: String, required: true },
  commitsCount: { type: Number, default: 0 },
  prCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IContributor>('Contributor', ContributorSchema);
