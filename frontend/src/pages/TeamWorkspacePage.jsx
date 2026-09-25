import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { fetchTeam } from '../api/teams.js';
import { fetchTeamTasks, updateTask, deleteTask } from '../api/tasks.js';
import { startConversation } from '../api/conversations.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Tabs } from '../components/ui/Tabs.jsx';
import { Button } from '../components/ui/Button.jsx';
import { TaskBoardColumn } from '../components/tasks/TaskBoardColumn.jsx';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal.jsx';

const STATUSES = ['todo', 'in-progress', 'done'];


export default function TeamWorkspacePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();


  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Task Board');
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
    Promise.all([fetchTeam(id), fetchTeamTasks(id)])
      .then(([teamRes, tasksRes]) => {
        setTeam(teamRes.data);
        setTasks(tasksRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);


  const myRole = team?.members.find((m) => m.user._id === user.id)?.role;
  const canManage = myRole === 'owner' || myRole === 'maintainer';


  async function handleStatusChange(taskId, status) {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    await updateTask(taskId, { status });
  }


  async function handleDelete(taskId) {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  }


  async function handleMessage(memberId) {
    const res = await startConversation(memberId);
    navigate(`/messages/${res.data._id}`);
  }


  if (loading) return <p className="p-8 text-center text-sm text-ink-400">Loading…</p>;
  if (error) return <p className="p-8 text-center text-sm text-danger-500">{error}</p>;
  if (!team) return null;


  return (    
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">{team.name}</h1>
          <p className="mt-1 text-sm text-ink-600">{team.members.length} members</p>
        </div>
        {activeTab === 'Task Board' && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-1.5 size-4" />
            New task
          </Button>
        )}
      </div>

      <div className="mt-6">
        <Tabs tabs={['Task Board', 'Members']} active={activeTab} onChange={setActiveTab} />
      </div>


      {activeTab === 'Task Board' && (
        <div className="mt-6 flex flex-col gap-4 lg:flex-row">
          {STATUSES.map((status) => (
            <TaskBoardColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              canManage={canManage}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}


      {activeTab === 'Members' && (
        <div className="mt-6 space-y-3">
          {team.members.map((m) => (
            <div
              key={m.user._id}
              className="flex flex-col gap-3 rounded-control border border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                  {m.user.name?.[0]?.toUpperCase()}
                </div>
               <Link
                  to={`/developers/${m.user._id}`}
                  className="text-sm font-medium text-ink-900 hover:text-brand-600"
                >
                  {m.user.name}
                </Link>
              </div>


              <div className="flex items-center gap-3">
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs capitalize text-ink-600">
                  {m.role}
                </span>
                {m.user._id !== user.id && (
                  <button
                    type="button"
                    onClick={() => handleMessage(m.user._id)}
                    className="rounded-full p-1.5 text-ink-400 hover:bg-surface-muted hover:text-brand-600"
                    title="Message this member"
                  >
                    <MessageSquare className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}


      {showCreateModal && (
        <CreateTaskModal
          teamId={id}
          members={team.members}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newTask) => {
            setTasks((prev) => [...prev, newTask]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}