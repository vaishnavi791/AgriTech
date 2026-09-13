import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: discriminating 401 unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';

      // Do NOT clear session or trigger global logout for login credential failure
      const isLoginRequest = requestUrl.includes('/auth/login');

      if (!isLoginRequest) {
        try {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        } catch {
          // Ignore localStorage errors
        }

        // Notify active AuthContext to reset state so protected views redirect immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
