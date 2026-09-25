import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Team } from '../models/Team.js';
import { Task } from '../models/Task.js';
import { Application } from '../models/Application.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';


function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    skills: user.skills,
    role: user.role,
    notificationPreferences: user.notificationPreferences,
    createdAt: user.createdAt,
  };
}


// GET /api/v1/users/:id
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  sendSuccess(res, 200, toPublicUser(user));
});


// PATCH /api/v1/users/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, avatar } = req.body;
  if (name !== undefined) req.user.name = name;
  if (bio !== undefined) req.user.bio = bio;
  if (skills !== undefined) req.user.skills = skills;
  if (avatar !== undefined) req.user.avatar = avatar;
  await req.user.save();
  sendSuccess(res, 200, toPublicUser(req.user));
});


// PATCH /api/v1/users/me/password
export const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;


  // req.user came from the auth middleware without the password field
  // (select: false from Phase 2) — re-fetch it WITH the password just
  // for this one check, same pattern as login in Phase 3.
  const userWithPassword = await User.findById(req.user._id).select('+password');
  const isMatch = await userWithPassword.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');


  userWithPassword.password = newPassword; // pre-save hook re-hashes it
  await userWithPassword.save();


  sendSuccess(res, 200, { updated: true });
});


// PATCH /api/v1/users/me/notification-preferences
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { applications, tasks } = req.body;
  if (applications !== undefined) req.user.notificationPreferences.applications = applications;
  if (tasks !== undefined) req.user.notificationPreferences.tasks = tasks;
  await req.user.save();
  sendSuccess(res, 200, req.user.notificationPreferences);
});


// DELETE /api/v1/users/me
export const deleteMyAccount = asyncHandler(async (req, res) => {
  const userWithPassword = await User.findById(req.user._id).select('+password');
  const isMatch = await userWithPassword.comparePassword(req.body.password);
  if (!isMatch) throw ApiError.unauthorized('Incorrect password');


  const userId = req.user._id;


  // Clean up everything this user OWNS (same cascade as single-project delete)
  const ownedProjects = await Project.find({ owner: userId });
  for (const project of ownedProjects) {
    const team = await Team.findOne({ project: project._id });
    if (team) {
      await Task.deleteMany({ team: team._id });
      await Team.deleteOne({ _id: team._id });
    }
    await Application.deleteMany({ project: project._id });
    await Project.deleteOne({ _id: project._id });
  }


  // Remove them from any OTHER teams they're a member (not owner) of
  await Team.updateMany({ 'members.user': userId }, { $pull: { members: { user: userId } } });


  // Withdraw their pending applications to other people's projects
  await Application.deleteMany({ applicant: userId });


  await User.deleteOne({ _id: userId });


  res.clearCookie(env.COOKIE_NAME);
  sendSuccess(res, 200, { deleted: true });
});



