import { Router } from 'express';
import {
  getUserProfile,
  updateMyProfile,
  changeMyPassword,
  updateNotificationPreferences,
  deleteMyAccount,
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileRules,
  changePasswordRules,
  updateNotificationPreferencesRules,
  deleteAccountRules,
} from '../validators/user.validator.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.get('/:id', getUserProfile);
router.patch('/me', authenticate, updateProfileRules, validate, updateMyProfile);
router.patch('/me/password', authenticate, changePasswordRules, validate, changeMyPassword);
router.patch(
  '/me/notification-preferences',
  authenticate,
  updateNotificationPreferencesRules,
  validate,
  updateNotificationPreferences
);
router.delete('/me', authenticate, deleteAccountRules, validate, deleteMyAccount);


export default router;
