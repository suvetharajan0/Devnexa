import { apiClient } from './client.js';


export function fetchConversations() {
  return apiClient.get('/conversations');
}


export function startConversation(participantId) {
  return apiClient.post('/conversations', { participantId });
}


export function fetchMessages(conversationId) {
  return apiClient.get(`/conversations/${conversationId}/messages`);
}


export function sendMessage(conversationId, body) {
  return apiClient.post(`/conversations/${conversationId}/messages`, { body });
}

export function clearConversation(conversationId) {
  return apiClient.delete(`/conversations/${conversationId}/messages`);
}
