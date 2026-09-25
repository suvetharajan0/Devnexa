import { apiClient } from './client.js';


export function fetchDashboard() {
  return apiClient.get('/dashboard');
}
