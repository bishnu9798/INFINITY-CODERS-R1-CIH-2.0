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

// Jobs API with real backend implementation
export const jobsAPI = {
  getAll: async (params = {}) => {
    return api.get('/jobs', { params });
  },

  getById: async (id) => {
    return api.get(`/jobs/${id}`);
  },

  create: async (jobData) => {
    return api.post('/jobs', jobData);
  },

  update: async (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },

  delete: async (id) => {
    return api.delete(`/jobs/${id}`);
  },

  getMyJobs: async () => {
    return api.get('/jobs/recruiter/my-jobs');
  }
};

// Applications API with real backend implementation
export const applicationsAPI = {
  apply: async (formData) => {
    return api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getMyApplications: async () => {
    return api.get('/applications/my-applications');
  },

  getJobApplications: async (jobId) => {
    return api.get(`/applications/job/${jobId}`);
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
