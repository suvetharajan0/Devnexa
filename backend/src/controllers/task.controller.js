import { Task } from '../models/Task.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../services/notification.service.js';


// GET /api/v1/teams/:id/tasks — any team member (req.team from middleware)
export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ team: req.team._id }).populate('assignee', 'name avatar');
  sendSuccess(res, 200, tasks);
});


// POST /api/v1/teams/:id/tasks — any team member
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, team: req.team._id });


  if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
    await createNotification({
      recipient: task.assignee,
      type: 'task',
      message: `You were assigned to "${task.title}"`,
      link: `/teams/${req.team._id}`,
    });
  }


  sendSuccess(res, 201, task);
});


// PATCH /api/v1/tasks/:id — any team member of that task's team
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound('Task not found');


  Object.assign(task, req.body);
  await task.save();
  sendSuccess(res, 200, task);
});


// DELETE /api/v1/tasks/:id — owner/maintainer only (checked in the route)
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw ApiError.notFound('Task not found');
  sendSuccess(res, 200, { deleted: true });
});
