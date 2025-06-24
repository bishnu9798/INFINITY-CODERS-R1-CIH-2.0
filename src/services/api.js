import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API with real backend implementation
export const authAPI = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  }
};

// Services API with real backend implementation
export const servicesAPI = {
  getAll: async (params = {}) => {
    return api.get('/services', { params });
  },

  getById: async (id) => {
    return api.get(`/services/${id}`);
  },

  create: async (serviceData) => {
    // Check if serviceData is FormData (for file uploads)
    const headers = serviceData instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

    return api.post('/services', serviceData, { headers });
  },

  update: async (id, serviceData) => {
    return api.put(`/services/${id}`, serviceData);
  },

  delete: async (id) => {
    return api.delete(`/services/${id}`);
  },

  getMyServices: async () => {
    return api.get('/services/recruiter/my-services');
  },

  // Backward compatibility alias
  getMyJobs: async () => {
    return api.get('/services/recruiter/my-services');
  },

  downloadResume: async (filename) => {
    return api.get(`/services/resume/${filename}`, {
      responseType: 'blob'
    });
  }
};

// Keep jobsAPI for backward compatibility (deprecated)
export const jobsAPI = servicesAPI;

// Applications API with real backend implementation
export const applicationsAPI = {
  apply: async (applicationData) => {
    // Check if it's FormData (for file uploads) or regular object (for direct application)
    const isFormData = applicationData instanceof FormData;

    if (isFormData) {
      // Legacy file upload approach
      return api.post('/applications', applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // New direct application approach
      return api.post('/applications', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },

  getMyApplications: async () => {
    return api.get('/applications/my-applications');
  },

  getServiceApplications: async (serviceId) => {
    return api.get(`/applications/service/${serviceId}`);
  },

  // Keep for backward compatibility
  getJobApplications: async (jobId) => {
    return api.get(`/applications/service/${jobId}`);
  },

  updateStatus: async (applicationId, status) => {
    return api.put(`/applications/${applicationId}/status`, { status });
  },

  getAllForRecruiter: async () => {
    return api.get('/applications/recruiter/all');
  },

  downloadResume: async (filename) => {
    return api.get(`/applications/resume/${filename}`, {
      responseType: 'blob'
    });
  }
};

// Users API with real backend implementation
export const usersAPI = {
  getProfile: async () => {
    return api.get('/users/profile');
  },

  updateProfile: async (profileData) => {
    return api.put('/users/profile', profileData);
  },

  getStats: async () => {
    return api.get('/users/stats');
  }
};

export default api;
