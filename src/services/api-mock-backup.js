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
        email: 'manish1@gmail.com',
        password: '123456',
        fullName: 'Manish Kumar',
        userType: 'jobseeker'
      },
      {
        id: 'user_2',
        email: 'manishmodi0408@gmail.com',
        password: '987654',
        fullName: 'Manish Modi',
        userType: 'recruiter',
        companyName: 'The Tech World'
      },
      {
        id: 'user_3',
        email: 'jobseeker@example.com',
        password: 'password123',
        fullName: 'John Doe',
        userType: 'jobseeker'
      },
      {
        id: 'user_4',
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
        title: 'Professional Web Development Services',
        mobile: '+1 (555) 123-4567',
        email: 'manishmodi0408@gmail.com',
        company: 'The Tech World',
        location: 'Remote Worldwide',
        experience: '4+ years',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js'],
        description: 'I offer comprehensive web development services including frontend and backend development. Specializing in React, Node.js, and modern web technologies. Available for both short-term projects and long-term contracts.',
        salaryRange: '$50/hour',
        jobType: 'hourly',
        serviceType: 'freelancing',
        resumeFileName: 'manish_resume.pdf',
        recruiter_id: 'user_2',
        created_at: new Date().toISOString()
      },
      {
        id: 'job_2',
        title: 'UI/UX Design & Consultation Services',
        mobile: '+1 (555) 987-6543',
        email: 'designer@example.com',
        company: 'Creative Solutions',
        location: 'New York, NY / Remote',
        experience: '2-4 years',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
        description: 'Offering professional UI/UX design services for web and mobile applications. From wireframes to high-fidelity prototypes, I help bring your ideas to life with user-centered design principles.',
        salaryRange: '$2,500/project',
        jobType: 'project',
        serviceType: 'freelancing',
        resumeFileName: 'designer_portfolio.pdf',
        recruiter_id: 'user_2',
        created_at: new Date().toISOString()
      },
      {
        id: 'job_3',
        title: 'Mobile App Development Services',
        mobile: '+1 (555) 456-7890',
        email: 'mobiledev@example.com',
        company: 'AppCraft Studios',
        location: 'San Francisco, CA',
        experience: '1-2 years',
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
        description: 'Specialized in cross-platform mobile app development using React Native and Flutter. From concept to deployment, I provide end-to-end mobile solutions for startups and enterprises.',
        salaryRange: '$75/hour',
        jobType: 'contract',
        serviceType: 'freelancing',
        resumeFileName: 'mobile_dev_resume.pdf',
        recruiter_id: 'user_4',
        created_at: new Date().toISOString()
      }
    ];
    setStoredData(STORAGE_KEYS.JOBS, sampleJobs);
  }
};

// Initialize sample data
initializeSampleData();

// Auth API with mock implementation
export const authAPI = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredData(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const token = `mock-token-${Date.now()}`;
          resolve({
            data: {
              message: 'Login successful',
              token,
              user: {
                id: user.id,
                _id: user.id, // For MongoDB compatibility
                email: user.email,
                userType: user.userType,
                fullName: user.fullName,
                companyName: user.companyName
              }
            }
          });
        } else {
          reject({
            response: {
              data: { error: 'Invalid credentials' }
            }
          });
        }
      }, 500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredData(STORAGE_KEYS.USERS);

        // Check if user already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          reject({
            response: {
              data: { error: 'User already exists with this email' }
            }
          });
          return;
        }

        // Create new user
        const newUser = {
          id: generateId(),
          email: userData.email,
          password: userData.password,
          userType: userData.userType,
          fullName: userData.fullName,
          companyName: userData.companyName || null,
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        setStoredData(STORAGE_KEYS.USERS, users);

        const token = `mock-token-${Date.now()}`;
        resolve({
          data: {
            message: 'User created successfully',
            token,
            user: {
              id: newUser.id,
              _id: newUser.id, // For MongoDB compatibility
              email: newUser.email,
              userType: newUser.userType,
              fullName: newUser.fullName,
              companyName: newUser.companyName
            }
          }
        });
      }, 500);
    });
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
