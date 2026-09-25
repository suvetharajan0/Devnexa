import { body } from 'express-validator';

export const createProjectRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('requiredSkills').optional().isArray(),
  body('techStack').optional().isArray(),
  body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'archived']),
];

export const updateProjectRules = [
  body('title').optional().trim().isLength({ max: 120 }),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'archived']),
];