import mongoose, { Document, Schema } from 'mongoose';

export interface IProcessingJob extends Document {
  workspaceId: mongoose.Types.ObjectId;
  repositoryId?: mongoose.Types.ObjectId;
  repositoryFullName: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
  progress: number;
  message?: string;
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
}, { timestamps: true });

export default mongoose.model<IProcessingJob>('ProcessingJob', ProcessingJobSchema);
