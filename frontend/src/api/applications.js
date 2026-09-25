
import { apiClient } from './client.js';


export function applyToProject(projectId, payload) {
  return apiClient.post(`/projects/${projectId}/apply`, payload);
}


export function fetchProjectApplications(projectId) {
  return apiClient.get(`/projects/${projectId}/applications`);
}

export function updateApplicationStatus(applicationId, status) {
  return apiClient.patch(`/applications/${applicationId}`, { status });
}

export function fetchMyApplication(projectId) {
  return apiClient.get(`/projects/${projectId}/my-application`);
}
