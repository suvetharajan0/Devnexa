import { useState } from 'react';
import { X } from 'lucide-react';
import { createTask } from '../../api/tasks.js';
import { Button } from '../ui/Button.jsx';


export function CreateTaskModal({ teamId, members, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignee, setAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await createTask(teamId, {
        title,
        description,
        priority,
        assignee: assignee || undefined,
      });
      onCreated(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-card bg-surface-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-900">New task</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="size-5" />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-left">
            <span className="mb-1 block text-sm font-medium text-ink-900">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
          </label>


          <label className="block text-left">
            <span className="mb-1 block text-sm font-medium text-ink-900">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
          </label>


          <div className="grid grid-cols-2 gap-3">
            <label className="block text-left">
              <span className="mb-1 block text-sm font-medium text-ink-900">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>


            <label className="block text-left">
              <span className="mb-1 block text-sm font-medium text-ink-900">Assignee</span>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>


          {error && <p className="text-sm text-danger-500">{error}</p>}


          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating…' : 'Create task'}
          </Button>
        </form>
      </div>
    </div>
  );
}