import { Router } from 'express';
import { updateTask, deleteTask } from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.js';
import { updateTaskRules } from '../validators/task.validator.js';
import { authenticate } from '../middleware/auth.js';
import { Task } from '../models/Task.js';
import { requireTeamMember, requireTeamRole } from '../middleware/team.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const router = Router();


// A task's own route only has :taskId in the URL, not the team — so we
// look up the task first to find its team, then reuse the same team
// membership middleware. This keeps the "are you on this team" logic in
// one single place instead of duplicating it here.
const loadTeamFromTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound('Task not found');
  req.params.teamId = task.team.toString();
  next();
});


router.patch('/:id', authenticate, loadTeamFromTask, requireTeamMember, updateTaskRules, validate, updateTask);
router.delete('/:id', authenticate, loadTeamFromTask, requireTeamMember, requireTeamRole('owner', 'maintainer'), deleteTask);


export default router;
