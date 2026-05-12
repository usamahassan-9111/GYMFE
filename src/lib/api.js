import axios from 'axios';

/**
 * Central Axios instance for all API calls
 * Uses VITE_API_BASE_URL environment variable
 * Falls back to http://localhost:4000/api if not set
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Automatically add auth token from localStorage to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error logging for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, {
        url: error.config.url,
        method: error.config.method,
        status: error.response.status,
        message: error.response.data?.message || error.message,
      });
    } else if (error.request) {
      console.error('API Error - No response:', {
        url: error.config.url,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;