import { body } from 'express-validator';


export const applyRules = [
  body('roleAppliedFor').optional().trim().isLength({ max: 100 }),
  body('message').optional().trim().isLength({ max: 1000 }),
];


export const updateApplicationStatusRules = [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
];
