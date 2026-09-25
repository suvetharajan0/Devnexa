import { Router } from 'express';
import { getTeam, updateTeam, listMyTeams } from '../controllers/team.controller.js';
import { listTasks, createTask } from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.js';
import { createTaskRules } from '../validators/task.validator.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeamMember, requireTeamRole } from '../middleware/team.js';

const router = Router();


router.get('/:id', authenticate, requireTeamMember, getTeam);
router.patch('/:id', authenticate, requireTeamMember, requireTeamRole('owner', 'maintainer'), updateTeam);


router.get('/:id/tasks', authenticate, requireTeamMember, listTasks);
router.post('/:id/tasks', authenticate, requireTeamMember, createTaskRules, validate, createTask);
router.get('/', authenticate, listMyTeams);
router.get('/:id', authenticate, requireTeamMember, getTeam);

export default router;
