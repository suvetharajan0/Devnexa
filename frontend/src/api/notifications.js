import { apiClient } from './client.js';


export function fetchNotifications() {
  return apiClient.get('/notifications');
}


export function markNotificationRead(id) {
  return apiClient.patch(`/notifications/${id}/read`);
}


export function markAllNotificationsRead() {
  return apiClient.patch('/notifications/read-all');
}