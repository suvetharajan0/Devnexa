import { Team } from '../models/Team.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// Loads the team from :id (or :teamId) in the URL, confirms the logged-in
// user is actually a member, and attaches both req.team and req.membership
// so controllers don't have to re-fetch or re-check.
export const requireTeamMember = asyncHandler(async (req, res, next) => {
  const teamId = req.params.teamId || req.params.id;
  const team = await Team.findById(teamId).populate('members.user', 'name avatar');
  if (!team) throw ApiError.notFound('Team not found');


  const membership = team.members.find(
    (m) => m.user._id.toString() === req.user._id.toString()
  );
  if (!membership) throw ApiError.forbidden('You are not a member of this team');


  req.team = team;
  req.membership = membership;
  next();
});


// Use after requireTeamMember — restricts to specific team roles, e.g.
// requireTeamRole('owner', 'maintainer')
export function requireTeamRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.membership.role)) {
      return next(ApiError.forbidden('You do not have permission to do this'));
    }
    next();
  };
}