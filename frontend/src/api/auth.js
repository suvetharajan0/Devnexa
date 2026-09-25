import { apiClient } from './client.js';

export function registerUser(payload) {
  return apiClient.post('/auth/register', payload);
}

export function loginUser(payload) {
  return apiClient.post('/auth/login', payload);
}

export function logoutUser() {
  return apiClient.post('/auth/logout');
}

export function fetchCurrentUser() {
  return apiClient.get('/auth/me');
}