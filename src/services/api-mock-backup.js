import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

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

// Mock data storage
const STORAGE_KEYS = {
  USERS: 'job_portal_users',
  JOBS: 'job_portal_jobs',
  APPLICATIONS: 'job_portal_applications',
  PROFILES: 'job_portal_profiles'
};

// Helper functions for mock data
const getStoredData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

const generateToken = () => 'mock_token_' + Math.random().toString(36).substr(2, 15);

// Initialize with sample data if empty
const initializeSampleData = () => {
  const users = getStoredData(STORAGE_KEYS.USERS);
  const jobs = getStoredData(STORAGE_KEYS.JOBS);

  if (users.length === 0) {
    const sampleUsers = [
      {
        id: 'user_1',
        email: 'jobseeker@example.com',
        password: 'password123',
        fullName: 'John Doe',
        userType: 'jobseeker'
      },
      {
        id: 'user_2',
        email: 'recruiter@example.com',
        password: 'password123',
        fullName: 'Jane Smith',
        userType: 'recruiter',
        companyName: 'TechCorp Inc'
      }
    ];
    setStoredData(STORAGE_KEYS.USERS, sampleUsers);
  }

  if (jobs.length === 0) {
    const sampleJobs = [
      {
        id: 'job_1',
        title: 'Frontend Developer',
        company: 'TechCorp Inc',
        location: 'San Francisco, CA',
        experience: '2-4 years',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        description: 'We are looking for a skilled Frontend Developer to join our team...',
        salaryRange: '$70,000 - $90,000',
        jobType: 'full-time',
        recruiter_id: 'user_2',
        created_at: new Date().toISOString()
      },
      {
        id: 'job_2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        experience: '3-5 years',
        skills: ['Node.js', 'React', 'MongoDB', 'Express'],
        description: 'Join our dynamic team as a Full Stack Engineer...',
        salaryRange: '$80,000 - $110,000',
        jobType: 'full-time',
        recruiter_id: 'user_2',
        created_at: new Date().toISOString()
      }
    ];
    setStoredData(STORAGE_KEYS.JOBS, sampleJobs);
  }
};

// Initialize sample data
initializeSampleData();

// Auth API with real backend implementation
export const authAPI = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  }
};

// Jobs API with mock implementation
export const jobsAPI = {
  getAll: async (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        resolve({ data: jobs });
      }, 300);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const job = jobs.find(j => j.id === id);

        if (job) {
          resolve({ data: job });
        } else {
          reject({
            response: {
              data: { error: 'Job not found' }
            }
          });
        }
      }, 300);
    });
  },

  create: async (jobData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const currentUser = JSON.parse(localStorage.getItem('user'));

        const newJob = {
          id: generateId(),
          ...jobData,
          recruiter_id: currentUser?.id,
          created_at: new Date().toISOString()
        };

        jobs.push(newJob);
        setStoredData(STORAGE_KEYS.JOBS, jobs);

        resolve({ data: newJob });
      }, 500);
    });
  },

  update: async (id, jobData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const jobIndex = jobs.findIndex(j => j.id === id);

        if (jobIndex !== -1) {
          jobs[jobIndex] = { ...jobs[jobIndex], ...jobData, updated_at: new Date().toISOString() };
          setStoredData(STORAGE_KEYS.JOBS, jobs);
          resolve({ data: jobs[jobIndex] });
        } else {
          reject({
            response: {
              data: { error: 'Job not found' }
            }
          });
        }
      }, 500);
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const jobIndex = jobs.findIndex(j => j.id === id);

        if (jobIndex !== -1) {
          jobs.splice(jobIndex, 1);
          setStoredData(STORAGE_KEYS.JOBS, jobs);

          // Also delete related applications
          const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
          const filteredApplications = applications.filter(app => app.jobId !== id);
          setStoredData(STORAGE_KEYS.APPLICATIONS, filteredApplications);

          resolve({ data: { message: 'Job deleted successfully' } });
        } else {
          reject({
            response: {
              data: { error: 'Job not found' }
            }
          });
        }
      }, 500);
    });
  },

  getMyJobs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const myJobs = jobs.filter(job => job.recruiter_id === currentUser?.id);
        resolve({ data: myJobs });
      }, 300);
    });
  }
};

// Applications API with mock implementation
export const applicationsAPI = {
  apply: async (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentUser) {
          reject({
            response: {
              data: { error: 'User not authenticated' }
            }
          });
          return;
        }

        // Check if already applied
        const existingApplication = applications.find(
          app => app.jobId === formData.get('jobId') && app.userId === currentUser.id
        );

        if (existingApplication) {
          reject({
            response: {
              data: { error: 'You have already applied for this job' }
            }
          });
          return;
        }

        const newApplication = {
          id: generateId(),
          jobId: formData.get('jobId'),
          userId: currentUser.id,
          userName: currentUser.fullName,
          userEmail: currentUser.email,
          coverLetter: formData.get('coverLetter') || '',
          resumeFile: formData.get('resume')?.name || 'resume.pdf',
          status: 'pending',
          appliedAt: new Date().toISOString()
        };

        applications.push(newApplication);
        setStoredData(STORAGE_KEYS.APPLICATIONS, applications);

        resolve({ data: newApplication });
      }, 500);
    });
  },

  getMyApplications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const currentUser = JSON.parse(localStorage.getItem('user'));

        const myApplications = applications
          .filter(app => app.userId === currentUser?.id)
          .map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return {
              ...app,
              job: job || { title: 'Job Not Found', company: 'Unknown' }
            };
          });

        resolve({ data: myApplications });
      }, 300);
    });
  },

  getJobApplications: async (jobId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const jobApplications = applications.filter(app => app.jobId === jobId);
        resolve({ data: jobApplications });
      }, 300);
    });
  },

  updateStatus: async (applicationId, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const appIndex = applications.findIndex(app => app.id === applicationId);

        if (appIndex !== -1) {
          applications[appIndex].status = status;
          applications[appIndex].updatedAt = new Date().toISOString();
          setStoredData(STORAGE_KEYS.APPLICATIONS, applications);
          resolve({ data: applications[appIndex] });
        } else {
          reject({
            response: {
              data: { error: 'Application not found' }
            }
          });
        }
      }, 500);
    });
  },

  getAllForRecruiter: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const jobs = getStoredData(STORAGE_KEYS.JOBS);
        const currentUser = JSON.parse(localStorage.getItem('user'));

        // Get jobs posted by current recruiter
        const myJobs = jobs.filter(job => job.recruiter_id === currentUser?.id);
        const myJobIds = myJobs.map(job => job.id);

        // Get applications for my jobs
        const myApplications = applications
          .filter(app => myJobIds.includes(app.jobId))
          .map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return {
              ...app,
              job: job || { title: 'Job Not Found', company: 'Unknown' }
            };
          });

        resolve({ data: myApplications });
      }, 300);
    });
  },

  downloadResume: async (filename) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock blob for resume download
        const blob = new Blob(['Mock resume content'], { type: 'application/pdf' });
        resolve({ data: blob });
      }, 300);
    });
  }
};

// Users API with mock implementation
export const usersAPI = {
  getProfile: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (currentUser) {
          const profiles = getStoredData(STORAGE_KEYS.PROFILES);
          const profile = profiles.find(p => p.userId === currentUser.id) || {
            userId: currentUser.id,
            ...currentUser,
            bio: '',
            skills: [],
            experience: '',
            education: '',
            location: '',
            phone: '',
            website: ''
          };

          resolve({ data: profile });
        } else {
          reject({
            response: {
              data: { error: 'User not authenticated' }
            }
          });
        }
      }, 300);
    });
  },

  updateProfile: async (profileData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentUser) {
          reject({
            response: {
              data: { error: 'User not authenticated' }
            }
          });
          return;
        }

        const profiles = getStoredData(STORAGE_KEYS.PROFILES);
        const profileIndex = profiles.findIndex(p => p.userId === currentUser.id);

        const updatedProfile = {
          userId: currentUser.id,
          ...profileData,
          updatedAt: new Date().toISOString()
        };

        if (profileIndex !== -1) {
          profiles[profileIndex] = updatedProfile;
        } else {
          profiles.push(updatedProfile);
        }

        setStoredData(STORAGE_KEYS.PROFILES, profiles);

        // Update user in localStorage
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        resolve({ data: updatedProfile });
      }, 500);
    });
  },

  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const applications = getStoredData(STORAGE_KEYS.APPLICATIONS);
        const jobs = getStoredData(STORAGE_KEYS.JOBS);

        let stats = {};

        if (currentUser?.userType === 'jobseeker') {
          const myApplications = applications.filter(app => app.userId === currentUser.id);
          stats = {
            totalApplications: myApplications.length,
            pendingApplications: myApplications.filter(app => app.status === 'pending').length,
            acceptedApplications: myApplications.filter(app => app.status === 'accepted').length,
            rejectedApplications: myApplications.filter(app => app.status === 'rejected').length,
            profileViews: Math.floor(Math.random() * 100) + 50,
            savedJobs: Math.floor(Math.random() * 20) + 5
          };
        } else if (currentUser?.userType === 'recruiter') {
          const myJobs = jobs.filter(job => job.recruiter_id === currentUser.id);
          const myJobIds = myJobs.map(job => job.id);
          const myApplications = applications.filter(app => myJobIds.includes(app.jobId));

          stats = {
            totalJobs: myJobs.length,
            activeJobs: myJobs.length,
            totalApplications: myApplications.length,
            pendingApplications: myApplications.filter(app => app.status === 'pending').length,
            acceptedApplications: myApplications.filter(app => app.status === 'accepted').length,
            rejectedApplications: myApplications.filter(app => app.status === 'rejected').length
          };
        }

        resolve({ data: stats });
      }, 300);
    });
  }
};

export default api;
