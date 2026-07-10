import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  confidence?: number;
  sources?: { name: string; url?: string; type: string }[];
}

export interface IConversation extends Document {
  workspaceId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
  confidence: { type: Number },
  sources: [{
    name: { type: String },
    url: { type: String },
    type: { type: String }
  }]
});

const ConversationSchema = new Schema<IConversation>({
  workspaceId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
