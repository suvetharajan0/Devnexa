import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    isGroup: { type: Boolean, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);