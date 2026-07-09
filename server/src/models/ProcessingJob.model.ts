import mongoose, { Document, Schema } from 'mongoose';

export interface IProcessingJob extends Document {
  workspaceId: mongoose.Types.ObjectId;
  repositoryId?: mongoose.Types.ObjectId;
  repositoryFullName: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
  progress: number;
  message?: string;
  currentStep?: string;
  logs: { timestamp: Date; message: string }[];
  statistics: {
    repositories: number;
    files: number;
    pullRequests: number;
    issues: number;
    commits: number;
    contributors: number;
    chunks: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcessingJobSchema: Schema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository' },
  repositoryFullName: { type: String, required: true },
  status: { type: String, enum: ['Queued', 'Running', 'Completed', 'Failed'], default: 'Queued' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  message: { type: String },
  currentStep: { type: String, default: 'Queued' },
  logs: [{
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true }
  }],
  statistics: {
    repositories: { type: Number, default: 0 },
    files: { type: Number, default: 0 },
    pullRequests: { type: Number, default: 0 },
    issues: { type: Number, default: 0 },
    commits: { type: Number, default: 0 },
    contributors: { type: Number, default: 0 },
    chunks: { type: Number, default: 0 },
  }
}, { timestamps: true });

export default mongoose.model<IProcessingJob>('ProcessingJob', ProcessingJobSchema);
