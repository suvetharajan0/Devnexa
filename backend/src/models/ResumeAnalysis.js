import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeText: { type: String, required: true },
    atsScore: { type: Number, min: 0, max: 100 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
  },
  { timestamps: true }
);

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);