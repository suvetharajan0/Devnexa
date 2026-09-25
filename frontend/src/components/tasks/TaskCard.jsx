import { Trash2 } from 'lucide-react';


const PRIORITY_STYLES = {
  low: 'bg-surface-muted text-ink-600',
  medium: 'bg-[#eaddff] text-brand-600',
  high: 'bg-red-100 text-danger-500',
};


const STATUSES = ['todo', 'in-progress', 'done'];


export function TaskCard({ task, canManage, onStatusChange, onDelete }) {
  return (
    <div className="rounded-control border border-border-subtle bg-surface-card p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-ink-900">{task.title}</h4>
        {canManage && (
          <button onClick={() => onDelete(task._id)} className="text-ink-400 hover:text-danger-500">
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>


      {task.description && (
        <p className="mt-1 text-xs text-ink-600 line-clamp-2">{task.description}</p>
      )}


      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>


        {task.assignee && (
          <div
            className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-600"
            title={task.assignee.name}
          >
            {task.assignee.name?.[0]?.toUpperCase()}
          </div>
        )}
      </div>


      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-3 w-full rounded-control border border-border-muted bg-surface-page px-2 py-1.5 text-xs outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

