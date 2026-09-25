import { Router } from 'express';
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.get('/', authenticate, listNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);


export default router;