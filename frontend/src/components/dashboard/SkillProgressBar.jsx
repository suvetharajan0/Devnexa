export function SkillProgressBar({ skill, percent }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-900">{skill}</span>
        <span className="text-ink-400">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}