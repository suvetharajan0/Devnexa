import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Team } from '../models/Team.js';

// GET /api/v1/teams/:id — req.team already loaded + membership-checked by middleware
export const getTeam = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, req.team);
});


// PATCH /api/v1/teams/:id — owner/maintainer only
export const updateTeam = asyncHandler(async (req, res) => {
  if (req.body.name) req.team.name = req.body.name;
  await req.team.save();
  sendSuccess(res, 200, req.team);
});

// GET /api/v1/teams — every team the logged-in user is a member of
export const listMyTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({ 'members.user': req.user._id })
    .populate('project', 'title status')
    .populate('members.user', 'name avatar');


  sendSuccess(res, 200, teams);
});
