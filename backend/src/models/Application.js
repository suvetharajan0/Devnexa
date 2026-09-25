import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleAppliedFor: { type: String, trim: true, default: 'Contributor' },
    message: { type: String, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevents the same user applying to the same project twice
applicationSchema.index({ project: 1, applicant: 1 }, { unique: true });
applicationSchema.index({applicant: 1, status: 1});

export const Application = mongoose.model('Application', applicationSchema);