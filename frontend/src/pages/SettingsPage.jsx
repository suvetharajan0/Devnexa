import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  changeMyPassword,
  updateNotificationPreferences,
  deleteMyAccount,
} from '../api/users.js';
import { Tabs } from '../components/ui/Tabs.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordInput } from '../components/ui/PasswordInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ToggleRow } from '../components/settings/ToggleRow.jsx';


export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');


  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold text-ink-900">Settings</h1>


      <div className="mt-6">
        <Tabs tabs={['Account', 'Notifications', 'Security']} active={activeTab} onChange={setActiveTab} />
      </div>


      {activeTab === 'Account' && <AccountTab user={user} logout={logout} />}
      {activeTab === 'Notifications' && (
        <NotificationsTab user={user} refreshUser={refreshUser} />
      )}
      {activeTab === 'Security' && <SecurityTab />}
    </div>
  );
}


function AccountTab({ user, logout }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);


  async function handleDelete(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await deleteMyAccount(password);
      await logout();
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }


  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-card bg-surface-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink-900">Account info</h2>
        <p className="mt-3 text-sm text-ink-600">
          <span className="font-medium text-ink-900">Name:</span> {user?.name}
        </p>
        <p className="mt-1 text-sm text-ink-600">
          <span className="font-medium text-ink-900">Email:</span> {user?.email}
        </p>
        <p className="mt-3 text-xs text-ink-400">
          To change your name, bio, or skills, visit your Profile page.
        </p>
      </div>


      <div className="rounded-card border border-red-200 bg-red-50 p-6">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-danger-500">
          <Trash2 className="size-4" />
          Delete account
        </h2>
        <p className="mt-1 text-xs text-ink-600">
          This permanently deletes your account, your owned projects and their teams/tasks, and
          removes you from any teams you've joined. This cannot be undone.
        </p>


        {!confirming ? (
          <Button
            variant="ghost"
            className="mt-3 text-danger-500 hover:bg-red-100"
            onClick={() => setConfirming(true)}
          >
            Delete my account
          </Button>
        ) : (
          <form onSubmit={handleDelete} className="mt-3 space-y-3">
            <Input
              label="Confirm your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-danger-500">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="bg-danger-500 hover:bg-red-600">
                {submitting ? 'Deleting…' : 'Permanently delete'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


function NotificationsTab({ user, refreshUser }) {
  const [prefs, setPrefs] = useState(
    user?.notificationPreferences || { applications: true, tasks: true }
  );
  const [desktopEnabled, setDesktopEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );


  async function handleToggle(key, value) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await updateNotificationPreferences({ [key]: value });
    refreshUser({ ...user, notificationPreferences: updated });
  }


  async function handleDesktopToggle(value) {
    if (value) {
      const result = await Notification.requestPermission();
      setDesktopEnabled(result === 'granted');
    } else {
      // Browsers don't allow revoking permission via JS — direct the user
      // to their browser settings instead of pretending we can turn it off.
      alert('To disable desktop notifications, use your browser\'s site settings for this page.');
    }
  }


  return (
    <div className="mt-6 rounded-card bg-surface-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-ink-900">Notification preferences</h2>
      <div className="mt-2 divide-y divide-border-subtle">
        <ToggleRow
          label="Application updates"
          description="Someone applies to your project, or your application is accepted/rejected"
          checked={prefs.applications}
          onChange={(v) => handleToggle('applications', v)}
        />
        <ToggleRow
          label="Task assignments"
          description="You're assigned to a task in a team workspace"
          checked={prefs.tasks}
          onChange={(v) => handleToggle('tasks', v)}
        />
        <ToggleRow
          label="Desktop notifications"
          description="Browser popup alerts when you're on another tab/app"
          checked={desktopEnabled}
          onChange={handleDesktopToggle}
        />
      </div>
    </div>
  );
}


function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

useEffect(()=>{
    if(error) setError('');
    if(success) setSuccess(false);
}, [currentPassword, newPassword]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="mt-6 rounded-card bg-surface-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-ink-900">Change password</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <PasswordInput
          label="Current password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
        {success && <p className="text-sm text-success-text">Password updated successfully.</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
