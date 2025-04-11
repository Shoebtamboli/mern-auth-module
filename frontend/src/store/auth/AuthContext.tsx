import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearErrors: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await authApi.getCurrentUser();
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      const { token, user } = response;
      
      // Store token in the appropriate storage based on "Remember Me" preference
      if (rememberMe) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token'); // Clear sessionStorage token if exists
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token'); // Clear localStorage token if exists
      }
      
      setUser(user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register({ 
        name, 
        email, 
        password, 
        confirmPassword: password 
      });
      
      const { token, user } = response;
      
      // Store token in session storage by default for new registrations
      sessionStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};