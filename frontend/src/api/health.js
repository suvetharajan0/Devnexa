import { apiClient } from './client.js';

export function getHealth() {
  return apiClient.get('/health');
}
