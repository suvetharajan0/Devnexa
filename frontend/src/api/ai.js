import { apiClient } from './client.js';


export function askCodeMentor(payload) {
  return apiClient.post('/ai/code-mentor', payload);
}


export function analyzeResume(resumeText) {
  return apiClient.post('/ai/resume-analyzer', { resumeText });
}


export function fetchResumeAnalysisHistory() {
  return apiClient.get('/ai/resume-analyzer/history');
}
