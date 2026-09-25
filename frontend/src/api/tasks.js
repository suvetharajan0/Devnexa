
import { apiClient } from './client.js';


export function fetchTeamTasks(teamId) {
  return apiClient.get(`/teams/${teamId}/tasks`);
}


export function createTask(teamId, payload) {
  return apiClient.post(`/teams/${teamId}/tasks`, payload);
}


export function updateTask(taskId, payload) {
  return apiClient.patch(`/tasks/${taskId}`, payload);
}


export function deleteTask(taskId) {
  return apiClient.delete(`/tasks/${taskId}`);
}
