import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, MessageSquare, Sparkles, User, Settings, LogOut, FileText, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { BRAND_NAME } from '../../lib/constants.js';


const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/code-mentor', label: 'Code Mentor AI', icon: Sparkles, badge: 'AI' },
  { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText, badge: 'AI' },
  { to: '/profile', label: 'Profile', icon: User },
];


export function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const { unreadCount } = useSocket();


  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition
     ${isActive ? 'bg-white/10 text-white' : 'text-sidebar-text hover:bg-white/5 hover:text-white'}`;


  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-hidden="true" />
      )}


      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col overflow-y-auto bg-sidebar-900 px-4 py-6 transition-transform duration-200
          lg:sticky lg:top-0 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
       <div className="flex items-center justify-between px-2">
          <Link to="/landing" className="flex items-center gap-2">
            <img src="/logo.png" alt={BRAND_NAME} className="size-8" />
            <span className="text-base font-bold text-white">{BRAND_NAME}</span>
          </Link>
          <button onClick={onClose} className="text-sidebar-text lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} className={linkClasses} onClick={onClose}>
              <Icon className="size-4" />
              <span className="flex-1">{label}</span>
              {to === '/messages' && unreadCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {badge && (
                <span className="rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-300">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>


        <div className="space-y-1 border-t border-white/10 pt-4">
          <NavLink to="/settings" className={linkClasses} onClick={onClose}>
            <Settings className="size-4" />
            Settings
          </NavLink>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-sidebar-text transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
