import { body } from 'express-validator';


export const sendMessageRules = [
  body('body').trim().notEmpty().withMessage('Message cannot be empty').isLength({ max: 2000 }),
];


export const startConversationRules = [
  body('participantId').isMongoId().withMessage('A valid participant ID is required'),
];

