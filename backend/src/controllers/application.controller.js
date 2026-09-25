import { Application } from '../models/Application.js';
import { Project } from '../models/Project.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Team } from '../models/Team.js';
import { createNotification } from '../services/notification.service.js';

// POST /api/v1/projects/:id/apply — any logged-in user

export const applyToProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');


  if (project.owner.toString() === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot apply to your own project');
  }


  const existing = await Application.findOne({
    project: project._id,
    applicant: req.user._id,
  });
  if (existing) throw ApiError.conflict('You have already applied to this project');


  const application = await Application.create({
    project: project._id,
    applicant: req.user._id,
    roleAppliedFor: req.body.roleAppliedFor,
    message: req.body.message,
  });


  await createNotification({
    recipient: project.owner,
    type: 'application',
    message: `${req.user.name} applied to join "${project.title}"`,
    link: `/projects/${project._id}`,
  });


  sendSuccess(res, 201, application);
});



// GET /api/v1/projects/:id/applications — owner only
export const listApplicationsForProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');


  if (project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can view applications');
  }


  const applications = await Application.find({ project: project._id })
    .populate('applicant', 'name avatar bio skills');


  sendSuccess(res, 200, applications);
});


// PATCH /api/v1/applications/:id — owner only, accept/reject
// PATCH /api/v1/applications/:id — owner only, accept/reject
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('project');
  if (!application) throw ApiError.notFound('Application not found');


  if (application.project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can update this application');
  }


  const updated = await Application.findOneAndUpdate(
    { _id: application._id, status: 'pending' },
    { status: req.body.status },
    { new: true }
  );


  if (!updated) {
    return sendSuccess(res, 200, application);
  }


  if (req.body.status === 'accepted') {
    const team = await Team.findOne({ project: application.project._id });
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === application.applicant.toString()
    );
    if (!alreadyMember) {
      team.members.push({ user: application.applicant, role: 'contributor' });
      await team.save();
    }
  }


  await createNotification({
    recipient: application.applicant,
    type: 'application',
    message: `Your application to "${application.project.title}" was ${req.body.status}`,
    link: `/projects/${application.project._id}`,
  });


  sendSuccess(res, 200, updated);
});
// GET /api/v1/projects/:id/my-application — any logged-in user, checks their OWN status
export const getMyApplicationForProject = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    project: req.params.id,
    applicant: req.user._id,
  });
  sendSuccess(res, 200, application); // null if they never applied — that's a valid, expected result
});
