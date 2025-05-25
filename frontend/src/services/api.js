/* eslint-disable no-unused-vars */
 
import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory token storage (since localStorage is not supported in Claude artifacts)
let authToken = null;
let userData = null;

// Mock storage for development (replace with localStorage in real app)
const mockStorage = {
  getItem: (key) => {
    if (key === 'token') return authToken;
    if (key === 'user') return userData ? JSON.stringify(userData) : null;
    return null;
  },
  setItem: (key, value) => {
    if (key === 'token') authToken = value;
    if (key === 'user') userData = JSON.parse(value);
  },
  removeItem: (key) => {
    if (key === 'token') authToken = null;
    if (key === 'user') userData = null;
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = mockStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear storage and redirect to login
      mockStorage.removeItem('token');
      mockStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// API Service object with all endpoints
export const apiService = {
  // Authentication endpoints
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.token) {
        mockStorage.setItem('token', response.token);
      }
      if (response.user) {
        mockStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      mockStorage.removeItem('token');
      mockStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear storage even if API call fails
      mockStorage.removeItem('token');
      mockStorage.removeItem('user');
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.token) {
        mockStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  },

  // User profile endpoints
  getProfile: async () => {
    try {
      return await apiClient.get('/user/profile');
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  },

  updateProfile: async (profileData) => {
    try {
      return await apiClient.put('/user/profile', profileData);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  // Report management endpoints
  getReports: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/reports?${queryString}` : '/reports';
      return await apiClient.get(url);
    } catch (error) {
      throw new Error('Failed to fetch reports');
    }
  },

  getReportById: async (reportId) => {
    try {
      return await apiClient.get(`/reports/${reportId}`);
    } catch (error) {
      throw new Error('Failed to fetch report details');
    }
  },

  uploadReport: async (formData, onUploadProgress) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
        timeout: 60000, // 60 seconds for file uploads
      };
      
      return await apiClient.post('/reports/upload', formData, config);
    } catch (error) {
      throw new Error(error.message || 'File upload failed');
    }
  },

  deleteReport: async (reportId) => {
    try {
      return await apiClient.delete(`/reports/${reportId}`);
    } catch (error) {
      throw new Error('Failed to delete report');
    }
  },

  // AI Analysis endpoints
  analyzeReport: async (reportId) => {
    try {
      return await apiClient.post(`/reports/${reportId}/analyze`);
    } catch (error) {
      throw new Error('Failed to analyze report');
    }
  },

  getInsights: async (reportId) => {
    try {
      return await apiClient.get(`/reports/${reportId}/insights`);
    } catch (error) {
      throw new Error('Failed to fetch insights');
    }
  },

  // Dashboard data endpoints
  getDashboardData: async () => {
    try {
      return await apiClient.get('/dashboard');
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  },

  getHealthMetrics: async (timeRange = '30d') => {
    try {
      return await apiClient.get(`/dashboard/metrics?range=${timeRange}`);
    } catch (error) {
      throw new Error('Failed to fetch health metrics');
    }
  },

  // Translation endpoints
  translateReport: async (reportId, targetLanguage) => {
    try {
      return await apiClient.post(`/reports/${reportId}/translate`, {
        language: targetLanguage
      });
    } catch (error) {
      throw new Error('Translation failed');
    }
  },

  // Clinic/Government specific endpoints
  getPatientReports: async (patientId) => {
    try {
      return await apiClient.get(`/clinic/patients/${patientId}/reports`);
    } catch (error) {
      throw new Error('Failed to fetch patient reports');
    }
  },

  getPopulationData: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = queryString ? `/government/population?${queryString}` : '/government/population';
      return await apiClient.get(url);
    } catch (error) {
      throw new Error('Failed to fetch population data');
    }
  },

  // Notifications endpoints
  getNotifications: async () => {
    try {
      return await apiClient.get('/notifications');
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      return await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      return await apiClient.get('/health');
    } catch (error) {
      throw new Error('Health check failed');
    }
  },

  // Development/Testing helper methods
  getCurrentUser: () => {
    return userData;
  },

  getCurrentToken: () => {
    return authToken;
  },

  // Mock data for development (remove in production)
  getMockData: () => {
    return {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        userType: 'patient'
      },
      reports: [
        {
          id: 1,
          title: 'Blood Test Results',
          date: '2024-01-15',
          type: 'blood_test',
          status: 'analyzed'
        }
      ]
    };
  }
};

// Export individual functions for easier imports
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  getReports,
  uploadReport,
  analyzeReport,
  getDashboardData,
  translateReport
} = apiService;

// Default export
export default apiService;