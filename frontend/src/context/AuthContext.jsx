import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync token from localStorage and fetch current user profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          setIsLoading(true);
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } catch {
          authService.logout();
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  // Centralized listener for unauthorized token expiration/invalidation
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      if (data?.access_token) {
        setToken(data.access_token);
        setUser(data.user || null);
      }
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const regData = await authService.register(userData);

      // Attempt seamless auto-login with submitted credentials
      try {
        const loginData = await authService.login({
          email: userData.email,
          password: userData.password,
        });
        if (loginData?.access_token) {
          setToken(loginData.access_token);
          const activeUser = loginData.user || regData?.user || null;
          setUser(activeUser);
          return { autoLoggedIn: true, user: activeUser, data: regData };
        }
      } catch {
        // Auto-login failed, but registration succeeded.
        // Clear tokens to guarantee user is not falsely authenticated.
        setToken(null);
        setUser(null);
      }

      return { autoLoggedIn: false, user: regData?.user || null, data: regData };
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
