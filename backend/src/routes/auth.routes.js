import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;