import { Link } from 'react-router-dom';

export function ProjectMiniCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block rounded-card border border-border-subtle bg-surface-card p-4 transition hover:border-brand-300"
    >
      <h4 className="text-sm font-semibold text-ink-900">{project.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-ink-600">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-ink-600"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}