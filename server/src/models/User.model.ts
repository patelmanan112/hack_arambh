import mongoose, { Document, Schema } from 'mongoose';
import { OAuthProviderName } from '../types/user.js';

export interface IUser extends Document {
  githubId: string;
  username: string;
  name?: string;
  email?: string;
  avatar: string;
  profileUrl: string;
  provider: OAuthProviderName;
  githubUsername?: string;
  githubAvatar?: string;
  githubAccessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  avatar: { type: String, required: true },
  profileUrl: { type: String, required: true },
  provider: { type: String, required: true },
  githubUsername: { type: String },
  githubAvatar: { type: String },
  githubAccessToken: { type: String },
  refreshToken: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
