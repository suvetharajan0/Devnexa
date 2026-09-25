import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyTeams } from '../api/teams.js';
import { Badge } from '../components/ui/Badge.jsx';


export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchMyTeams()
      .then((res) => setTeams(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold text-ink-900">Your Teams</h1>
      <p className="mt-1 text-sm text-ink-600">Workspaces for projects you're part of.</p>


      {loading && <p className="mt-8 text-center text-sm text-ink-400">Loading…</p>}
      {error && <p className="mt-8 text-center text-sm text-danger-500">{error}</p>}


      {!loading && !error && teams.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-400">
          You're not part of any teams yet — apply to a project or create one.
        </p>
      )}


      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {teams.map((team) => (
          <Link
            key={team._id}
            to={`/teams/${team._id}`}
            className="rounded-card border border-border-subtle bg-surface-card p-5 transition hover:border-brand-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">{team.name}</h3>
              {team.project?.status && <Badge status={team.project.status} />}
            </div>
            <p className="mt-2 text-xs text-ink-600">{team.members.length} members</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
