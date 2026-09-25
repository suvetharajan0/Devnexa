import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../api/projects.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { FilterToolbar } from '../components/projects/FilterToolbar.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';


export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);


  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const debouncedSearch = useDebouncedValue(search, 400);


  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);


  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');


    fetchProjects({ search: debouncedSearch, status, page, limit: 9 })
      .then((res) => {
        if (cancelled) return;
        setProjects(res.data);
        setMeta(res.meta);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });


    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, status, page]);


  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">Browse Projects</h1>
          <p className="mt-1 text-sm text-ink-600">
            Find a project that matches your skills and interests.
          </p>
        </div>
        <Link to="/projects/new" className="sm:shrink-0">
          <Button className="w-full sm:w-auto">New Project</Button>
        </Link>
      </div>


      <div className="mt-6">
        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      </div>


      <div className="mt-6">
        {loading && (
          <p className="py-12 text-center text-sm text-ink-400">Loading projects…</p>
        )}


        {!loading && error && (
          <p className="py-12 text-center text-sm text-danger-500">{error}</p>
        )}


        {!loading && !error && projects.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-400">
            No projects match your search yet.
          </p>
        )}


        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>


      <Pagination page={page} totalPages={meta.totalPages} onPageChange={setPage} />
    </div>
  );
}