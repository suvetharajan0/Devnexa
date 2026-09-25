import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    requiredSkills: [{ type: String, trim: true }],
    techStack: [{ type: String, trim: true }],
    category: { type: String, trim: true, default: 'General' },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'archived'],
      default: 'planning',
    },
  },
  { timestamps: true }
);

// Speeds up Browse Projects search/filter (Phase 6)
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ techStack: 1 });
projectSchema.index({ status: 1 });

export const Project = mongoose.model('Project', projectSchema);