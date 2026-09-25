import { Router } from 'express';
import { updateApplicationStatus } from '../controllers/application.controller.js';
import { validate } from '../middleware/validate.js';
import { updateApplicationStatusRules } from '../validators/application.validator.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.patch('/:id', authenticate, updateApplicationStatusRules, validate, updateApplicationStatus);


export default router;