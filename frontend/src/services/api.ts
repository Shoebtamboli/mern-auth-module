import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
export const authApi = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login a user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, passwords: { password: string; confirmPassword: string }) => {
    const response = await api.post(`/auth/reset-password/${token}`, passwords);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  }
};

export default api;