import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge.jsx';


export function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="flex flex-col rounded-card border border-border-subtle bg-surface-card p-5 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink-900">{project.title}</h3>
        <Badge status={project.status} />
      </div>


      <p className="mt-2 line-clamp-2 flex-1 text-xs text-ink-600">{project.description}</p>


      {project.techStack?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-ink-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}


      <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3 text-xs text-ink-400">
        <div className="flex size-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-600">
          {project.owner?.name?.[0]?.toUpperCase() || '?'}
        </div>
        {project.owner?.name || 'Unknown owner'}
      </div>
    </Link>
  );
}