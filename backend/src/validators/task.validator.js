import { body } from 'express-validator';


export const createTaskRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('description').optional().trim(),
  body('assignee').optional().isMongoId(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
];


export const updateTaskRules = [
  body('title').optional().trim().isLength({ max: 150 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assignee').optional().isMongoId(),
];

