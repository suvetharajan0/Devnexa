import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';


// Turns "React, Node.js,  MongoDB" into ["React", "Node.js", "MongoDB"] —
// trims whitespace and drops empty entries from stray commas.
function parseTagList(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}


export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    requiredSkills: '',
    status: 'planning',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await createProject({
        title: form.title,
        description: form.description,
        techStack: parseTagList(form.techStack),
        requiredSkills: parseTagList(form.requiredSkills),
        status: form.status,
      });
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold text-ink-900">Create a project</h1>
      <p className="mt-1 text-sm text-ink-600">
        This automatically creates a team workspace for it too.
      </p>


      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-card bg-surface-card p-6 shadow-sm">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          required
        />


        <label className="block text-left">
          <span className="mb-1 block text-sm font-medium text-ink-900">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            required
            className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>


        <Input
          label="Tech stack (comma-separated)"
          placeholder="React, Node.js, MongoDB"
          value={form.techStack}
          onChange={(e) => update('techStack', e.target.value)}
        />


        <Input
          label="Skills needed (comma-separated)"
          placeholder="JavaScript, REST APIs"
          value={form.requiredSkills}
          onChange={(e) => update('requiredSkills', e.target.value)}
        />


        <label className="block text-left">
          <span className="mb-1 block text-sm font-medium text-ink-900">Status</span>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </label>


        {error && <p className="text-sm text-danger-500">{error}</p>}


        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating…' : 'Create project'}
        </Button>
      </form>
    </div>
  );
}