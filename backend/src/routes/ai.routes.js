import { Router } from 'express';
import { codeMentor, resumeAnalyzer, resumeAnalyzerHistory } from '../controllers/ai.controller.js';
import { validate } from '../middleware/validate.js';
import { codeMentorRules, resumeAnalyzerRules } from '../validators/ai.validator.js';
import { authenticate } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/aiRateLimiter.js';


const router = Router();


router.post('/code-mentor', authenticate, aiRateLimiter, codeMentorRules, validate, codeMentor);
router.post(
  '/resume-analyzer',
  authenticate,
  aiRateLimiter,
  resumeAnalyzerRules,
  validate,
  resumeAnalyzer
);
router.get('/resume-analyzer/history', authenticate, resumeAnalyzerHistory);


export default router;