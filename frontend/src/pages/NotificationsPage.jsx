import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notifications.js';
import { useSocket } from '../context/SocketContext.jsx';
import { NotificationItem } from '../components/notifications/NotificationItem.jsx';
import { Button } from '../components/ui/Button.jsx';


export default function NotificationsPage() {
  const { clearNotifUnread } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchNotifications()
      .then((res) => setNotifications(res.data))
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
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Notifications</h1>
        <Button variant="ghost" onClick={handleMarkAllRead}>
          Mark all read
        </Button>
      </div>


      <div className="mt-6 rounded-card bg-surface-card p-2 shadow-sm">
        {loading && <p className="p-6 text-center text-sm text-ink-400">Loading…</p>}
        {!loading && notifications.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-400">You're all caught up.</p>
        )}
        {notifications.map((n) => (
          <NotificationItem key={n._id} notification={n} onRead={handleRead} />
        ))}
      </div>
    </div>
  );
}
