import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { NotificationItem } from './NotificationItem.jsx';
import { Link } from 'react-router-dom';


export function NotificationDropdown({ onClose }) {
  const { clearNotifUnread } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchNotifications()
      .then((res) => setNotifications(res.data.slice(0, 8)))
      .finally(() => setLoading(false));
    clearNotifUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function handleRead(id) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  }


  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }


  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-card border border-border-subtle bg-surface-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <h3 className="text-sm font-semibold text-ink-900">Notifications</h3>
        <button onClick={handleMarkAllRead} className="text-xs text-brand-600 hover:underline">
          Mark all read
        </button>
      </div>


      <div className="max-h-96 overflow-y-auto p-2">
        {loading && <p className="p-4 text-center text-xs text-ink-400">Loading…</p>}
        {!loading && notifications.length === 0 && (
          <p className="p-4 text-center text-xs text-ink-400">No notifications yet.</p>
        )}
        {notifications.map((n) => (
          <NotificationItem key={n._id} notification={n} onRead={handleRead} />
        ))}
      </div>


      <Link
        to="/notifications"
        onClick={onClose}
        className="block border-t border-border-subtle px-4 py-2.5 text-center text-xs font-medium text-brand-600 hover:bg-surface-muted"
      >
        View all
      </Link>
    </div>
  );
}
