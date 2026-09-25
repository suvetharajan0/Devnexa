import { apiClient } from './client.js';


export function fetchUserProfile(userId) {
  return apiClient.get(`/users/${userId}`);
}


export function updateMyProfile(payload) {
  return apiClient.patch('/users/me', payload);
}


export function changeMyPassword(payload) {
  return apiClient.patch('/users/me/password', payload);
}


export function updateNotificationPreferences(payload) {
  return apiClient.patch('/users/me/notification-preferences', payload);
}


export function deleteMyAccount(password) {
  return apiClient.delete('/users/me', { data: { password } });
}
