import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service connecting to FastAPI JWT endpoints.
 *
 * Implements login, registration, current user profile fetching, and session management.
 * Note: Never logs or exposes raw tokens or sensitive credentials.
 */
export const authService = {
  /**
   * Authenticate a user with login credentials.
   *
   * @param {Object} credentials
   * @param {string} credentials.email - User email address
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Resolves with { access_token, token_type, user }
   */
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    const data = response.data;
    if (data?.access_token) {
      try {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
        if (data.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return data;
  },

  /**
   * Register a new user account.
   *
   * @param {Object} userData
   * @param {string} userData.email - User email address
   * @param {string} userData.password - User password (min 8 chars)
   * @param {string} [userData.full_name] - Optional full name
   * @param {string} [userData.name] - Fallback name field from form
   * @returns {Promise<Object>} Resolves with { status, message, user }
   */
  async register(userData) {
    const payload = {
      email: userData.email.trim(),
      password: userData.password,
      full_name: (userData.full_name || userData.name || '').trim() || undefined,
    };

    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },

  /**
   * Retrieve current authenticated user profile from /api/auth/me.
   *
   * @returns {Promise<Object|null>} Current user profile or null
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    if (response.data) {
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      } catch {
        // Ignore localStorage errors
      }
    }
    return response.data;
  },

  /**
   * Terminate active session and clear stored credentials.
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Ignore localStorage errors
    }
  },

  /**
   * Retrieve active authentication token from client storage.
   *
   * @returns {string|null}
   */
  getToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },

  /**
   * Retrieve cached user profile from client storage.
   *
   * @returns {Object|null}
   */
  getStoredUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Verify whether the client holds an active token.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },
};

export default authService;
