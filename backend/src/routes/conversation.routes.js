import { Router } from 'express';
import {
  listConversations,
  startConversation,
  listMessages,
  sendMessage,
  clearConversationMessages,
} from '../controllers/conversation.controller.js';
import { validate } from '../middleware/validate.js';
import { sendMessageRules, startConversationRules } from '../validators/message.validator.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.get('/', authenticate, listConversations);
router.post('/', authenticate, startConversationRules, validate, startConversation);
router.get('/:id/messages', authenticate, listMessages);
router.post('/:id/messages', authenticate, sendMessageRules, validate, sendMessage);
router.delete('/:id/messages', authenticate, clearConversationMessages);


export default router;
