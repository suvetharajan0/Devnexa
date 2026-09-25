import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// GET /api/v1/notifications
export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort('-createdAt')
    .limit(50);
  sendSuccess(res, 200, notifications);
});


// PATCH /api/v1/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  sendSuccess(res, 200, notification);
});


// PATCH /api/v1/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  sendSuccess(res, 200, { updated: true });
});

