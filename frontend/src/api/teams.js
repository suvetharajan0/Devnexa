import { apiClient } from './client.js';


export function fetchTeam(id) {
  return apiClient.get(`/teams/${id}`);
}

export function fetchMyTeams() {
  return apiClient.get('/teams');
}