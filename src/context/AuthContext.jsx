import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 'loading' | 'authenticated' | 'error'
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const initSession = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      await authApi.createSession();
      setStatus('authenticated');
    } catch (err) {
      // If session creation fails, redirect to API for Cloudflare Access auth
      const currentUrl = window.location.href;
      const apiUrl = import.meta.env.VITE_API_URL 
      window.location.href = `${apiUrl}/v1/auth/session?redirect=${encodeURIComponent(currentUrl)}`;
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Register a global 401 handler so any expired-session API call drops us back to error state
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setError('Your session has expired. Please try again.');
      setStatus('error');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // best-effort; clear local state regardless
    }
    setError('You have been signed out.');
    setStatus('error');
  }, []);

  return (
    <AuthContext.Provider value={{ status, error, logout, retry: initSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
