import { Link } from 'react-router-dom';
import { Circle } from 'lucide-react';


function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}


export function NotificationItem({ notification, onRead }) {
  return (
    <Link
      to={notification.link || '#'}
      onClick={() => !notification.isRead && onRead(notification._id)}
      className={`flex items-start gap-3 rounded-control px-3 py-3 transition hover:bg-surface-muted
        ${!notification.isRead ? 'bg-brand-50' : ''}`}
    >
      {!notification.isRead && <Circle className="mt-1.5 size-2 shrink-0 fill-brand-500 text-brand-500" />}
      <div className={!notification.isRead ? '' : 'pl-5'}>
        <p className="text-sm text-ink-900">{notification.message}</p>
        <p className="mt-0.5 text-xs text-ink-400">{timeAgo(notification.createdAt)}</p>
      </div>
    </Link>
  );
}
