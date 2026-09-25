import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['owner', 'maintainer', 'contributor'],
          default: 'contributor',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

teamSchema.index({ 'members.user': 1 });
export const Team = mongoose.model('Team', teamSchema);