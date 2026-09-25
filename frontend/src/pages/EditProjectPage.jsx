
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectById, updateProject } from '../api/projects.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';


function parseTagList(value) {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}


export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchProjectById(id).then((res) => {
      const p = res.data;
      setForm({
        title: p.title,
        description: p.description,
        techStack: p.techStack.join(', '),
        requiredSkills: p.requiredSkills.join(', '),
        status: p.status,
      });
    });
  }, [id]);


  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await updateProject(id, {
        title: form.title,
        description: form.description,
        techStack: parseTagList(form.techStack),
        requiredSkills: parseTagList(form.requiredSkills),
        status: form.status,
      });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  if (!form) return <p className="p-8 text-center text-sm text-ink-400">Loading…</p>;


  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold text-ink-900">Edit project</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-card bg-surface-card p-6 shadow-sm">
        <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />

        <label className="block text-left">
          <span className="mb-1 block text-sm font-medium text-ink-900">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={6}
            required
            className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <Input
          label="Tech stack (comma-separated)"
          value={form.techStack}
          onChange={(e) => update('techStack', e.target.value)}
        />
        <Input
          label="Skills needed (comma-separated)"
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


        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
