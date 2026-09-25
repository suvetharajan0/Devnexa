import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { getIO } from '../sockets/index.js';


// Saves a notification AND pushes it live — but only if the recipient
// hasn't turned this notification type off in Settings. Checking here,
// in one place, means every future notification trigger automatically
// respects preferences without each caller needing to remember to check.
export async function createNotification({ recipient, type, message, link }) {
  const user = await User.findById(recipient).select('notificationPreferences');
  const prefs = user?.notificationPreferences || {};


  if (type === 'application' && prefs.applications === false) return null;
  if (type === 'task' && prefs.tasks === false) return null;


  const notification = await Notification.create({ recipient, type, message, link });


  try {
    const io = getIO();
    io.to(`user:${recipient}`).emit('notification:new', notification);
  } catch {
    // Socket not initialized yet — DB write already succeeded, safe to skip.
  }


  return notification;
}
