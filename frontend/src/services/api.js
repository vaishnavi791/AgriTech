import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

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

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user on 401
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    const apiMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.detail;
    if (typeof apiMessage === 'string') {
      error.message = apiMessage;
    }
    if (!error.response) {
      error.message = 'Unable to reach the AgriTech server. Please verify that the backend is running.';
    }
    return Promise.reject(error);
  }
);

export default api;

