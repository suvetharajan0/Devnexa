import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { NotificationDropdown } from '../notifications/NotificationDropdown.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';


export function TopHeader({ onMenuClick }) {
  const { user } = useAuth();
  const { notifUnreadCount } = useSocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);


  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-border-subtle bg-surface-card px-4 sm:px-6">
      <button onClick={onMenuClick} className="text-ink-600 lg:hidden">
        <Menu className="size-5" />
      </button>


      <div className={`relative max-w-sm flex-1 ${mobileSearchOpen ? 'block' : 'hidden'} sm:block`}>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search projects, people…"
          className="w-full rounded-control border border-border-muted bg-surface-muted py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500"
        />
      </div>


      <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
        <button
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="rounded-full p-2 text-ink-600 hover:bg-surface-muted sm:hidden"
        >
          <Search className="size-5" />
        </button>


        <ThemeToggle />


        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="relative rounded-full p-2 hover:bg-surface-muted"
          >
            <Bell className="size-5 text-ink-600" />
            {notifUnreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {notifUnreadCount > 9 ? '9+' : notifUnreadCount}
              </span>
            )}
          </button>
          {dropdownOpen && <NotificationDropdown onClose={() => setDropdownOpen(false)} />}
        </div>


        <Link to="/profile" className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
}
