
import { askCodeMentor } from '../services/ai/codeMentor.service.js';
import { generateResumeAnalysis } from '../services/ai/resumeAnalyzer.service.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// POST /api/v1/ai/code-mentor
export const codeMentor = asyncHandler(async (req, res) => {
  const { code, language, question } = req.body;
  const result = await askCodeMentor({ code, language, question });
  sendSuccess(res, 200, result);
});


// POST /api/v1/ai/resume-analyzer
export const resumeAnalyzer = asyncHandler(async (req, res) => {
  const { resumeText } = req.body;
  const result = await generateResumeAnalysis({ resumeText });


  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    resumeText,
    atsScore: result.atsScore,
    strengths: result.strengths,
    improvements: result.improvements,
  });


  sendSuccess(res, 200, saved);
});


// GET /api/v1/ai/resume-analyzer/history
export const resumeAnalyzerHistory = asyncHandler(async (req, res) => {
  const history = await ResumeAnalysis.find({ user: req.user._id })
    .sort('-createdAt')
    .select('atsScore strengths improvements createdAt');


  sendSuccess(res, 200, history);
});

