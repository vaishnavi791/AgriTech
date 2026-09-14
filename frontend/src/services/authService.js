import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service Interface.
 * Connects frontend sign-in and registration to FastAPI JWT endpoints.
 */
export const authService = {
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
    const { access_token, user } = response.data;
    if (access_token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
    }
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return response.data;
  },

  async register(userData) {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: userData.email,
      password: userData.password,
      full_name: userData.name || userData.full_name || null,
    });
    return await this.login({
      email: userData.email,
      password: userData.password,
    });
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      const user = response.data;
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.logout();
      }
      return null;
    }
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Handle restricted environments
    }
  },

  getToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },

  getStoredUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },
};

export default authService;
