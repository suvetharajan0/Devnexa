import { body } from 'express-validator';


export const codeMentorRules = [
  body('code').trim().notEmpty().withMessage('Please provide some code').isLength({ max: 8000 }),
  body('language').optional().trim().isLength({ max: 40 }),
  body('question').optional().trim().isLength({ max: 500 }),
];


export const resumeAnalyzerRules = [
  body('resumeText')
    .trim()
    .notEmpty()
    .withMessage('Please paste your resume text')
    .isLength({ min: 50, max: 10000 })
    .withMessage('Resume text should be between 50 and 10,000 characters'),
];
