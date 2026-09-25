import { useState } from 'react';
import { X } from 'lucide-react';
import { applyToProject } from '../../api/applications.js';
import { Button } from '../ui/Button.jsx';


export function ApplyModal({ projectId, onClose, onApplied }) {
  const [roleAppliedFor, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await applyToProject(projectId, { roleAppliedFor, message });
      onApplied();
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
          <h3 className="text-lg font-bold text-ink-900">Apply to this project</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="size-5" />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-left">
            <span className="mb-1 block text-sm font-medium text-ink-900">
              Role you're applying for (optional)
            </span>
            <input
              value={roleAppliedFor}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
          </label>


          <label className="block text-left">
            <span className="mb-1 block text-sm font-medium text-ink-900">
              Message to the project owner
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Why do you want to join?"
              className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
          </label>


          {error && <p className="text-sm text-danger-500">{error}</p>}


          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </form>
      </div>
    </div>
  );
}