import { useEffect, useState } from 'react';
import { FolderKanban, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchDashboard } from '../api/dashboard.js';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { ProjectMiniCard } from '../components/dashboard/ProjectMiniCard.jsx';
import { ActivityFeedItem } from '../components/dashboard/ActivityFeedItem.jsx';


function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}


export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <p className="p-8 text-center text-sm text-ink-400">Loading…</p>;
  if (!data) return null;


  const { stats, skills, recommendedProjects, activity } = data;


  return (
    <div className="mx-auto max-w-6xl px-6 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Welcome back, {user?.name} 👋</h1>
        <p className="mt-1 text-sm text-ink-600">Here's what's happening with your projects.</p>
      </div>


      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FolderKanban} />
        <StatCard label="Tasks Completed" value={stats.tasksCompleted} icon={CheckCircle2} />
        <StatCard
          label="Success Rate"
          value={stats.successRate === null ? '—' : `${stats.successRate}%`}
          icon={TrendingUp}
        />
      </div>


      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-card bg-surface-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-ink-900">Recommended for you</h2>
            {recommendedProjects.length === 0 ? (
              <p className="mt-4 text-sm text-ink-400">
                No new projects to recommend right now — check back later.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recommendedProjects.map((project) => (
                  <ProjectMiniCard key={project._id} project={{ id: project._id, ...project }} />
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="space-y-6">
          <div className="rounded-card bg-surface-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-ink-900">Your skills</h2>
            {skills.length === 0 ? (
              <p className="mt-4 text-sm text-ink-400">
                No skills added yet — add some on your Profile page.
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>


          <div className="rounded-card bg-surface-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-ink-900">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="mt-4 text-sm text-ink-400">Nothing here yet.</p>
            ) : (
              <div className="mt-2 divide-y divide-border-subtle">
                {activity.map((item, i) => (
                  <ActivityFeedItem
                    key={i}
                    message={item.message}
                    timestamp={timeAgo(item.timestamp)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}