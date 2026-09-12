import { STORAGE_KEYS } from '../utils/constants';

/**
 * Decoupled Authentication Service Interface.
 *
 * This module defines the client-side authentication contract ready for future
 * FastAPI JWT backend endpoint integration.
 *
 * It intentionally avoids hardcoding specific endpoint paths (such as /auth/login
 * or /auth/me) and avoids generating fake tokens or mock user sessions.
 */
export const authService = {
  /**
   * Authenticate a user with login credentials.
   *
   * @param {Object} credentials - The user credentials.
   * @param {string} credentials.email - The user's registered email address.
   * @param {string} credentials.password - The user's password.
   * @returns {Promise<Object>} Resolves with authenticated user/token payload upon backend connection.
   */
  async login(credentials) {
    // Decoupled interface: ready for the backend contract to be defined later.
    // Explicitly avoids fake authentication or mock sessions.
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'Authentication API contract is not yet connected to the backend. Live sign-in will be enabled once the FastAPI JWT endpoint is integrated.'
          )
        );
      }, 500);
    });
  },

  /**
   * Register a new user account.
   *
   * @param {Object} userData - The registration data.
   * @param {string} userData.name - Full name of the user.
   * @param {string} userData.email - User email address.
   * @param {string} userData.password - User password.
   * @returns {Promise<Object>} Resolves with created user/token payload upon backend connection.
   */
  async register(userData) {
    // Decoupled interface: ready for the backend contract to be defined later.
    // Explicitly avoids fake registration or mock sessions.
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'Registration API contract is not yet connected to the backend. Account creation will be enabled once the FastAPI JWT endpoint is integrated.'
          )
        );
      }, 500);
    });
  },

  /**
   * Retrieve current authenticated user profile.
   *
   * @returns {Promise<Object|null>}
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    // Interface ready for user profile endpoint
    return null;
  },

  /**
   * Terminate active session and clear stored tokens.
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Handle restricted environments
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
   * Verify whether the client holds an active session.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },
};

export default authService;
