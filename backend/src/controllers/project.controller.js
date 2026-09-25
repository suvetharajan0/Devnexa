import { Project } from '../models/Project.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Team } from '../models/Team.js'
import { Task } from '../models/Task.js'
import { Application } from '../models/Application.js'
 
// GET /api/v1/projects  — list, with search/filter/sort/pagination
export const listProjects = asyncHandler(async (req, res) => {
  const { search, status, techStack, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const query = {};
  if (search) query.$text = { $search: search };
  if (status) query.status = status;
  if (techStack) query.techStack = { $in: techStack.split(',') };

  const skip = (Number(page) - 1) * Number(limit);

  const [projects, total] = await Promise.all([
    Project.find(query)
      .populate('owner', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(query),
  ]);

  sendSuccess(res, 200, projects, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/v1/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('owner', 'name avatar bio');
  if (!project) throw ApiError.notFound('Project not found');
  sendSuccess(res, 200, project);
});

// POST /api/v1/projects
// NOTE: once Phase 3 (Auth) exists, `owner` will come from req.user.id
// instead of the request body — for now we accept it directly so this
// endpoint is testable before login exists.
// POST /api/v1/projects  (now requires login — owner comes from the token, not the body)


export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id });


  // Every project gets exactly one team, created automatically, with the
  // creator as its first member ('owner' role — controls task deletion etc.)
  const team = await Team.create({
    project: project._id,
    name: `${project.title} Team`,
    members: [{ user: req.user._id, role: 'owner' }],
  });


  project.team = team._id;
  await project.save();


  sendSuccess(res, 201, project);
});

// PATCH /api/v1/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');


  if (project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can edit this project');
  }


  Object.assign(project, req.body);
  await project.save();


  sendSuccess(res, 200, project);
});

// DELETE /api/v1/projects/:id
// Deleting a project should clean up everything that only exists because
// of it — its team, that team's tasks, and any pending/past applications.
// Otherwise those become "orphaned" records with no valid project to
// point back to (exactly what caused the Teams page bug).
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');


  if (project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can delete this project');
  }


  const team = await Team.findOne({ project: project._id });
  if (team) {
    await Task.deleteMany({ team: team._id });
    await Team.deleteOne({ _id: team._id });
  }
  await Application.deleteMany({ project: project._id });
  await Project.deleteOne({ _id: project._id });


  sendSuccess(res, 200, { deleted: true });
});