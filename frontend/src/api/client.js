import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // send/receive the httpOnly JWT cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);
