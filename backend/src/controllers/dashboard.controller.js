import { Team } from '../models/Team.js';
import { Task } from '../models/Task.js';
import { Application } from '../models/Application.js';
import { Project } from '../models/Project.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// GET /api/v1/dashboard — one aggregated payload for the Dashboard page
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;


  // Teams the user belongs to, so we can look up "their" tasks/projects
  const myTeams = await Team.find({ 'members.user': userId }).select('_id project');
  const myTeamIds = myTeams.map((t) => t._id);
  const myProjectIds = myTeams.map((t) => t.project).filter(Boolean);


  const [activeProjectsCount, tasksCompletedCount, applications, recommendedProjects, myTasks] =
    await Promise.all([
      Project.countDocuments({ _id: { $in: myProjectIds }, status: 'active' }),
      Task.countDocuments({ team: { $in: myTeamIds }, status: 'done' }),
      Application.find({ applicant: userId }),
      Project.find({
        _id: { $nin: myProjectIds },
        owner: { $ne: userId },
        status: 'active',
      })
        .sort('-createdAt')
        .limit(4)
        .populate('owner', 'name'),
      Task.find({ assignee: userId }).sort('-updatedAt').limit(5).populate('team', 'name'),
    ]);


  const successRate =
    applications.length === 0
      ? null
      : Math.round(
          (applications.filter((a) => a.status === 'accepted').length / applications.length) * 100
        );


  // "Recent activity" built from real recent applications + task updates —
  // not a dedicated activity log (that's a bigger feature for later), but
  // genuinely derived from real data rather than invented.
  const activity = [
    ...applications.slice(-3).map((a) => ({
      message: `Application ${a.status} for a project`,
      timestamp: a.updatedAt,
    })),
    ...myTasks.slice(0, 3).map((t) => ({
      message: `Task "${t.title}" — ${t.status}`,
      timestamp: t.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);


  sendSuccess(res, 200, {
    stats: {
      activeProjects: activeProjectsCount,
      tasksCompleted: tasksCompletedCount,
      successRate, // null means "not enough data yet", handled in the UI
    },
    skills: req.user.skills || [],
    recommendedProjects,
    activity,
  });
});
