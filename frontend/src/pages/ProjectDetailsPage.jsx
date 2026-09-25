import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProjectById, deleteProject } from '../api/projects.js';
import {
  fetchProjectApplications,
  updateApplicationStatus,
  fetchMyApplication,
} from '../api/applications.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Tabs } from '../components/ui/Tabs.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ApplyModal } from '../components/projects/ApplyModal.jsx';


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();


  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [showApplyModal, setShowApplyModal] = useState(false);


  // The real source of truth for "have I applied, and what happened" —
  // null means "never applied", otherwise it's { status: 'pending'|'accepted'|'rejected', ... }
  const [myApplication, setMyApplication] = useState(null);


  const [applications, setApplications] = useState([]);


  useEffect(() => {
    fetchProjectById(id)
      .then((res) => setProject(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);


  const isOwner = project && user && project.owner._id === user.id;


  // Only need this for non-owners — the owner never "applies" to their own project
  useEffect(() => {
    if (project && !isOwner) {
      fetchMyApplication(id).then((res) => setMyApplication(res.data));
    }
  }, [project, isOwner, id]);


  useEffect(() => {
    if (isOwner && activeTab === 'Applications') {
      fetchProjectApplications(id).then((res) => setApplications(res.data));
    }
  }, [isOwner, activeTab, id]);


  async function handleDecision(applicationId, status) {
    await updateApplicationStatus(applicationId, status);
    setApplications((prev) =>
      prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
    );
  }

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      'Delete this project? This also deletes its team, tasks, and applications. This cannot be undone.'
    );
    if (!confirmed) return;


    await deleteProject(id);
    navigate('/projects');
  }


  if (loading) return <p className="p-8 text-center text-sm text-ink-400">Loading…</p>;
  if (error) return <p className="p-8 text-center text-sm text-danger-500">{error}</p>;
  if (!project) return null;


  const tabs = isOwner ? ['Overview', 'Applications'] : ['Overview'];


  return ( 
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-card bg-surface-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">{project.title}</h1>
              <Badge status={project.status} />
            </div>
            <p className="mt-1 text-sm text-ink-600">Owned by {project.owner?.name}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.team && (isOwner || myApplication?.status === 'accepted') && (
              <Link to={`/teams/${project.team}`}>
                <Button variant="ghost">Team Workspace</Button>
              </Link>
            )}
            {isOwner && (
              <>
                <Link to={`/projects/${id}/edit`}>
                  <Button variant="ghost">Edit</Button>
                </Link>
                <Button variant="ghost" onClick={handleDeleteProject}>
                  Delete
                </Button>
              </>
            )}


            {!isOwner && myApplication === null && (
              <Button onClick={() => setShowApplyModal(true)}>Apply to join</Button>
            )}
            {!isOwner && myApplication?.status === 'pending' && (
              <Button disabled>Application pending</Button>
            )}
            {!isOwner && myApplication?.status === 'accepted' && (
              <span className="text-sm font-medium text-success-text">You're a member ✓</span>
            )}
            {!isOwner && myApplication?.status === 'rejected' && (
              <span className="text-sm font-medium text-ink-400">Application not accepted</span>
            )}
          </div>
        </div>


        <div className="mt-6">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>


        {activeTab === 'Overview' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-600">{project.description}</p>
            </div>


            <div className="space-y-4">
              {project.techStack?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase text-ink-400">Tech stack</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-ink-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              {project.requiredSkills?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase text-ink-400">
                    Skills needed
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {activeTab === 'Applications' && isOwner && (
          <div className="mt-6 space-y-3">
            {applications.length === 0 && (
              <p className="text-sm text-ink-400">No applications yet.</p>
            )}
            {applications.map((app) => (
              <div
                key={app._id}
               className="flex flex-col gap-3 rounded-control border border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {app.applicant.name}{' '}
                    {app.roleAppliedFor && (
                      <span className="font-normal text-ink-600">
                        — {app.roleAppliedFor}
                      </span>
                    )}
                  </p>
                  {app.message && <p className="mt-1 text-xs text-ink-600">{app.message}</p>}
                </div>


                {app.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button onClick={() => handleDecision(app._id, 'accepted')}>Accept</Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDecision(app._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Badge status={app.status === 'accepted' ? 'active' : 'archived'}>
                    {app.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {showApplyModal && (
        <ApplyModal
          projectId={id}
          onClose={() => setShowApplyModal(false)}
          onApplied={() => {
            // Re-fetch the real status instead of just guessing "pending" —
            // keeps this in sync with whatever the backend actually saved.
            fetchMyApplication(id).then((res) => setMyApplication(res.data));
            setShowApplyModal(false);
          }}
        />
      )}
    </div>
  );
}