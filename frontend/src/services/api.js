import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { getUserFriendlyError } from '../utils/errorHandling';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize API failures and clear expired sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url?.split('?')[0] || '';
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (!requestPath.includes('/auth/login')) {
        window.dispatchEvent(new Event('agritech:session-expired'));
      }
    }

    error.userMessage = getUserFriendlyError(error);
    error.message = error.userMessage;
    console.error('AgriTech API request failed', {
      path: requestPath,
      status: error.response?.status,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

export default api;

