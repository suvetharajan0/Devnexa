import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, MessageSquare, Check, X } from 'lucide-react';
import { updateMyProfile } from '../../api/users.js';
import { startConversation } from '../../api/conversations.js';
import { Button } from '../ui/Button.jsx';
import { SkillTagEditor } from './SkillTagEditor.jsx';


// A single component powers two different experiences:
// mode="own"    → your profile, with an Edit button and inline editing
// mode="public" → someone else's profile, read-only, with a Message button
export function DeveloperProfile({ user, mode, onUpdated }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, bio: user.bio, skills: user.skills });
  const [saving, setSaving] = useState(false);


  const isOwn = mode === 'own';


  async function handleSave() {
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      onUpdated(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }


  function handleCancel() {
    setForm({ name: user.name, bio: user.bio, skills: user.skills });
    setEditing(false);
  }


  async function handleMessage() {
    const res = await startConversation(user.id);
    navigate(`/messages/${res.data._id}`);
  }


  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-card bg-surface-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-600">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-control border border-border-muted px-2 py-1 text-lg font-bold text-ink-900 outline-none focus:border-brand-500"
                />
              ) : (
                <h1 className="text-xl font-bold text-ink-900">{user.name}</h1>
              )}
              {isOwn && <p className="text-sm text-ink-600">{user.email}</p>}
            </div>
          </div>


      {isOwn && !editing && (
            <Button variant="ghost" onClick={() => setEditing(true)} className="w-full sm:w-auto">
              <Pencil className="mr-1.5 size-4" />
              Edit
            </Button>
          )}
          {!isOwn && (
            <Button onClick={handleMessage} className="w-full sm:w-auto">
              <MessageSquare className="mr-1.5 size-4" />
              Message
            </Button>
          )}
        </div>


        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase text-ink-400">Bio</h3>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="mt-2 w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
          ) : (
            <p className="mt-2 text-sm text-ink-600">{user.bio || 'No bio yet.'}</p>
          )}
        </div>


        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase text-ink-400">Skills</h3>
          <div className="mt-2">
            {editing ? (
              <SkillTagEditor
                skills={form.skills}
                onChange={(skills) => setForm({ ...form, skills })}
              />
            ) : user.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400">No skills added yet.</p>
            )}
          </div>
        </div>


        {editing && (
          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              <Check className="mr-1.5 size-4" />
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="ghost" onClick={handleCancel}>
              <X className="mr-1.5 size-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}




