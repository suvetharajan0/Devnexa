import { apiClient } from './client.js';


// Builds a query string like ?search=ai&status=active&page=2 — only
// including params that actually have a value, so we don't send empty ones.
export function fetchProjects(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  );
  return apiClient.get('/projects', { params: cleanParams });
}

export function fetchProjectById(id) {
  return apiClient.get(`/projects/${id}`);
}

export function createProject(payload) {
  return apiClient.post('/projects', payload);
}


export function updateProject(id, payload) {
  return apiClient.patch(`/projects/${id}`, payload);
}

export function deleteProject(id) {
  return apiClient.delete(`/projects/${id}`);
}

