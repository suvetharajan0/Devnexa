import { TaskCard } from './TaskCard.jsx';


const COLUMN_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };


export function TaskBoardColumn({ status, tasks, canManage, onStatusChange, onDelete }) {
  return (
    <div className="w-full rounded-card bg-surface-muted p-3 lg:flex-1">
      <h3 className="mb-3 px-1 text-xs font-semibold uppercase text-ink-600">
        {COLUMN_LABELS[status]} · {tasks.length}
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canManage={canManage}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-ink-400">No tasks</p>
        )}
      </div>
    </div>
  );
}