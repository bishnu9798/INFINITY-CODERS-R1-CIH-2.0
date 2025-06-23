import React, { useState, useEffect } from 'react';
import { authAPI, jobsAPI, applicationsAPI, usersAPI } from './services/api-mock-backup';
import LandingPage from './components/LandingPage';
import AdvancedJobSearch from './components/AdvancedJobSearch';
import EnhancedJobCard from './components/EnhancedJobCard';
import { filterJobs, sortJobsByRelevance, getFilterSummary } from './utils/jobFilters';
import './enhanced-styles.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recruiterApplications, setRecruiterApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobAlerts, setJobAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    searchQuery: '',
    location: '',
    radius: 25,
    salaryMin: '',
    salaryMax: '',
    jobType: [],
    companySize: '',
    industry: '',
    datePosted: '',
    experienceLevel: '',
    skills: '',
    remoteWork: ''
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Login/Registration form state
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'jobseeker', // 'jobseeker' = Client, 'recruiter' = Freelancer
    companyName: ''
  });

  const [savedClientInfo, setSavedClientInfo] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('savedClientInfo');
    return saved ? JSON.parse(saved) : [];
  });
  const [showClientInfoList, setShowClientInfoList] = useState(false);

  // Load initial data and check authentication
  useEffect(() => {
    // Initialize dark mode and dashboard layout from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedDashboardLayout = localStorage.getItem('dashboardLayout') || 'default';
    setDarkMode(savedDarkMode);
    setDashboardLayout(savedDashboardLayout);

    // Apply dark mode class to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setShowLandingPage(false);
        loadJobs();
        loadUserProfile(); // Load profile for all users
        loadSavedJobs(); // Load saved jobs
        if (parsedUser.userType === 'jobseeker') {
          loadMyApplications();
        } else if (parsedUser.userType === 'recruiter') {
          loadRecruiterApplications();
          loadRecruiterJobs();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        handleLogout();
      }
    } else {
      loadJobs(); // Load public jobs even when not authenticated
    }
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll({ search: searchQuery });
      // Convert MongoDB _id to id for frontend compatibility
      const jobsWithId = response.data.map(job => ({
        ...job,
        id: job._id,
        skills: typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : job.skills || []
      }));
      setJobs(jobsWithId);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      // Convert MongoDB _id to id for frontend compatibility
      const applicationsWithId = response.data.map(app => ({
        ...app,
        id: app._id
      }));
      setApplications(applicationsWithId);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadRecruiterApplications = async () => {
    try {
      const response = await applicationsAPI.getAllForRecruiter();
      console.log('Recruiter applications loaded:', response.data);
      // Convert MongoDB _id to id for frontend compatibility
      const applicationsWithId = response.data.map(app => ({
        ...app,
        id: app._id
      }));
      setRecruiterApplications(applicationsWithId);
    } catch (error) {
      console.error('Error loading recruiter applications:', error);
    }
  };

  const loadRecruiterJobs = async () => {
    try {
      const response = await jobsAPI.getMyJobs();
      console.log('Recruiter jobs loaded:', response.data);
      // Convert MongoDB _id to id for frontend compatibility
      const jobsWithId = response.data.map(job => ({
        ...job,
        id: job._id,
        skills: typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : job.skills || []
      }));
      setRecruiterJobs(jobsWithId);
    } catch (error) {
      console.error('Error loading recruiter jobs:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError('');
      const response = await usersAPI.getProfile();
      console.log('User profile loaded:', response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfileError('Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setProfileLoading(true);
      setProfileError('');
      await usersAPI.updateProfile(profileData);
      alert('Profile updated successfully!');
      loadUserProfile(); // Reload profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError(error.response?.data?.error || 'Failed to update profile');
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Dashboard layout functions
  const changeDashboardLayout = (layout) => {
    setDashboardLayout(layout);
    localStorage.setItem('dashboardLayout', layout);
  };

  // Saved jobs functions
  const loadSavedJobs = () => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  };

  const toggleSaveJob = (job) => {
    const isAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id);
    let newSavedJobs;

    if (isAlreadySaved) {
      newSavedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
    } else {
      newSavedJobs = [...savedJobs, job];
    }

    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  // Notification functions
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 notifications
  };

  // Enhanced search and filtering functions
  const handleFiltersChange = (newFilters) => {
    setSearchFilters(newFilters);
    applyFiltersAndSort(newFilters, sortBy);
  };

  const applyFiltersAndSort = (filters, sortOption) => {
    let filtered = filterJobs(jobs, filters);

    // Apply sorting
    switch (sortOption) {
      case 'relevance':
        filtered = sortJobsByRelevance(filtered, filters);
        break;
      case 'date':
        filtered = filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'salary':
        filtered = filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary_range?.replace(/[^0-9]/g, '') || '0');
          const salaryB = parseInt(b.salary_range?.replace(/[^0-9]/g, '') || '0');
          return salaryB - salaryA;
        });
        break;
      case 'company':
        filtered = filtered.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
      default:
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFiltersAndSort(searchFilters, newSortBy);
  };

  // Update filtered jobs when jobs change
  useEffect(() => {
    applyFiltersAndSort(searchFilters, sortBy);
  }, [jobs]);

  // Get search skills for matching
  const getSearchSkills = () => {
    return searchFilters.skills
      ? searchFilters.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];
  };

  // Reload jobs when search query changes
  useEffect(() => {
    if (isAuthenticated || searchQuery) {
      loadJobs();
    }
  }, [searchQuery]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError('');

      console.log('Attempting login with:', { email, password: '***' });
      const response = await authAPI.login(email, password);
      console.log('Login response:', response.data);

      const { token, user: userData } = response.data;

      // Convert MongoDB _id to id for frontend compatibility
      const userWithId = {
        ...userData,
        id: userData._id || userData.id
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithId));

      setUser(userWithId);
      setIsAuthenticated(true);
      setShowLandingPage(false);
      setActiveTab('dashboard');

      // Load user-specific data
      loadJobs();
      loadUserProfile(); // Load profile for all users
      if (userData.userType === 'jobseeker') {
        loadMyApplications();
      } else if (userData.userType === 'recruiter') {
        loadRecruiterApplications();
        loadRecruiterJobs();
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError('');

      console.log('Attempting registration with data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response.data);

      const { token, user: newUser } = response.data;

      // Convert MongoDB _id to id for frontend compatibility
      const userWithId = {
        ...newUser,
        id: newUser._id || newUser.id
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithId));

      setUser(userWithId);
      setIsAuthenticated(true);
      setShowLandingPage(false);
      setActiveTab('dashboard');

      loadJobs();
      loadUserProfile(); // Load profile for all users
      if (newUser.userType === 'recruiter') {
        loadRecruiterApplications();
        loadRecruiterJobs();
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);

      let errorMessage = 'Registration failed';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowLandingPage(true);
    setActiveTab('dashboard');
    setApplications([]);
    setRecruiterApplications([]);
    setRecruiterJobs([]);
    setUserProfile(null);
    setResume(null);
    setEditingJob(null);
    setShowEditModal(false);
    setProfileError('');
    loadJobs(); // Load public jobs after logout
  };

  const handleJobApply = async (jobId) => {
    if (!resume) {
      alert("Please upload your resume first by going to the Resume tab");
      return;
    }

    console.log('Applying for job:', jobId, 'with resume:', resume.name);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('resume', resume);

      console.log('FormData created, sending application...');
      const response = await applicationsAPI.apply(formData);
      console.log('Application response:', response.data);

      alert("Successfully applied to the job!");
      loadMyApplications(); // Reload applications
      // Also reload recruiter applications if there are any recruiters logged in
      // This is for real-time updates in case multiple users are using the system
    } catch (error) {
      console.error('Application error:', error);
      console.error('Error response:', error.response?.data);

      let errorMessage = 'Failed to apply for job';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);

    if (!file) {
      return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isValidType = validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.docx');

    if (!isValidType) {
      alert("Please upload a PDF or DOCX file.");
      e.target.value = ''; // Clear the input
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 10MB.");
      e.target.value = ''; // Clear the input
      return;
    }

    setResume(file);
    console.log('Resume set:', file.name, file.size, file.type);
    alert(`Resume "${file.name}" selected successfully!`);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Validate mobile number format
    const mobileValue = form.mobile.value;
    const mobileRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!mobileRegex.test(mobileValue)) {
      alert('Please enter a valid mobile number (at least 10 digits)');
      return;
    }

    // Validate email format
    const emailValue = form.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      alert('Please enter a valid email address');
      return;
    }

    const serviceData = {
      title: form.title.value,
      mobile: mobileValue,
      email: emailValue,
      company: form.company.value,
      location: form.location.value,
      experience: form.experience.value,
      skills: form.skills.value.split(',').map(skill => skill.trim()),
      description: form.description.value,
      salaryRange: form.salaryRange?.value || '',
      jobType: form.jobType?.value || 'hourly',
      serviceType: 'freelancing', // Mark this as a freelancing service
      resumeFile: form.resume?.files[0] || null
    };

    try {
      setLoading(true);

      // If there's a resume file, we could handle file upload here
      // For now, we'll just include the file info in the service data
      if (serviceData.resumeFile) {
        serviceData.resumeFileName = serviceData.resumeFile.name;
        serviceData.resumeFileSize = serviceData.resumeFile.size;
        // In a real implementation, you'd upload the file to a server
        console.log('Resume file selected:', serviceData.resumeFile);
      }

      await jobsAPI.create(serviceData);
      form.reset();
      // Clear file info display
      const fileInfo = form.querySelector('.file-info');
      if (fileInfo) {
        fileInfo.textContent = '';
      }
      alert("Freelancing service posted successfully!");
      loadJobs(); // Reload jobs
      loadRecruiterJobs(); // Reload recruiter's jobs
      setActiveTab('recruiter-jobs');
    } catch (error) {
      console.error('Service posting error:', error);
      alert(error.response?.data?.error || 'Failed to post freelancing service');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJobClick = (job) => {
    setEditingJob(job);
    setShowEditModal(true);
  };

  const handleEditJobSubmit = async (jobData) => {
    try {
      setLoading(true);
      await jobsAPI.update(editingJob.id, jobData);
      alert("Job updated successfully!");
      loadJobs();
      loadRecruiterJobs(); // Reload recruiter's jobs
      setShowEditModal(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Job update error:', error);
      alert(error.response?.data?.error || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmMessage = `Are you sure you want to delete the service "${jobTitle}"?\n\nThis action cannot be undone and will also delete all applications for this service.`;

    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await jobsAPI.delete(jobId);
        alert("Service deleted successfully!");
        loadJobs();
        loadRecruiterJobs(); // Reload recruiter's jobs
      } catch (error) {
        console.error('Service deletion error:', error);
        alert(error.response?.data?.error || 'Failed to delete service');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingJob(null);
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      setLoading(true);
      await applicationsAPI.updateStatus(applicationId, status);
      alert("Application status updated successfully!");
      // Reload applications if needed
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Use filtered jobs for display
  const displayJobs = filteredJobs.length > 0 ? filteredJobs : jobs;

  // Render components remain unchanged — only backend logic was added
  const renderDashboard = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">WELCOME TO FREELANCER MARKET PLACE</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Featured Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayJobs.slice(0, 6).map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-bold text-blue-600">{job.title}</h4>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location} | {job.experience}</p>
              <div className="mt-3 mb-4">
                {job.skills.map((skill, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              {user?.userType === 'jobseeker' ? (
                <button
                  onClick={() => handleJobApply(job.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Applying...' : 'Apply Now'}
                </button>
              ) : user?.userType === 'recruiter' && job.recruiter_id === user.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* TODO: Implement edit modal */}}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (profileLoading && !userProfile) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
          </div>
        </div>
      );
    }

    // Only show client (jobseeker) fields
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">PROFILE</h2>

        {profileError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {profileError}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const profileData = {
              fullName: form.fullName.value,
              email: form.email.value,
              phone: form.phone.value,
              location: form.location.value,
              companyName: form.companyName?.value || '',
              timestamp: new Date().toISOString(),
            };
            updateUserProfile(profileData);
            // Save to list
            const updatedList = [profileData, ...savedClientInfo];
            setSavedClientInfo(updatedList);
            localStorage.setItem('savedClientInfo', JSON.stringify(updatedList));
          }} className="space-y-6">

            {/* Client Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={userProfile?.full_name || user?.fullName || ''}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userProfile?.email || user?.email || ''}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={userProfile?.phone || ''}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={userProfile?.location || ''}
                    placeholder="City, State/Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    defaultValue={userProfile?.company_name || user?.companyName || ''}
                    placeholder="Your company (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={loadUserProfile}
                disabled={profileLoading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientInfoList(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  View Saved Info
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Modal for Saved Client Info List */}
        {showClientInfoList && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowClientInfoList(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Saved Client Information</h3>
              {savedClientInfo.length === 0 ? (
                <div className="text-gray-500">No saved information yet.</div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {savedClientInfo.map((info, idx) => (
                    <li key={idx} className="py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium text-gray-700">Name:</span> {info.fullName}</div>
                        <div><span className="font-medium text-gray-700">Email:</span> {info.email}</div>
                        <div><span className="font-medium text-gray-700">Phone:</span> {info.phone}</div>
                        <div><span className="font-medium text-gray-700">Location:</span> {info.location}</div>
                        <div><span className="font-medium text-gray-700">Company:</span> {info.companyName}</div>
                        <div><span className="font-medium text-gray-700">Saved:</span> {new Date(info.timestamp).toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Profile Preview Section */}
        {userProfile && (
          <div className="mt-6 bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span> {userProfile.full_name || 'Not set'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span> {userProfile.email || 'Not set'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span> {userProfile.phone || 'Not set'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span> {userProfile.location || 'Not set'}
              </div>
              <div>
                <span className="font-medium text-gray-700">Company:</span> {userProfile.company_name || 'Not set'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJobs = () => (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Enhanced Search Component */}
      <div className="mb-6">
        <AdvancedJobSearch
          onFiltersChange={handleFiltersChange}
          darkMode={darkMode}
          initialFilters={searchFilters}
          jobCount={filteredJobs.length}
        />
      </div>

      {/* Filter Summary and Sort Options */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div className="flex-1">
          {/* Filter Summary */}
          {getFilterSummary(searchFilters) && (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Showing results for: <span className="font-medium">{getFilterSummary(searchFilters)}</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredJobs.length} of {jobs.length} jobs
            </span>

            {user?.userType === 'jobseeker' && (
              <button
                onClick={() => setActiveTab('saved-jobs')}
                className={`px-3 py-1 rounded-md transition-colors duration-200 text-sm ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Saved ({savedJobs.length})
              </button>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date Posted</option>
            <option value="salary">Salary</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>

      {/* Enhanced Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => {
          const isJobSaved = savedJobs.some(savedJob => savedJob.id === job.id);
          return (
            <EnhancedJobCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              isJobSaved={isJobSaved}
              onSaveToggle={() => {
                toggleSaveJob(job);
                addNotification(
                  isJobSaved ? `Removed "${job.title}" from saved jobs` : `Saved "${job.title}" to your saved jobs`,
                  isJobSaved ? 'info' : 'success'
                );
              }}
              onApply={() => {
                handleJobApply(job.id);
                addNotification(`Applied for "${job.title}" at ${job.company}`, 'success');
              }}
              onViewDetails={() => {
                addNotification(`Viewing details for "${job.title}"`, 'info');
                // TODO: Implement job details modal
              }}
              searchSkills={getSearchSkills()}
              userType={user?.userType}
              loading={loading}
              onEdit={() => handleEditJobClick(job)}
              onDelete={() => handleDeleteJob(job.id, job.title)}
              userId={user?.id}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && jobs.length > 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">No jobs match your criteria</h3>
          <p className="mt-1">Try adjusting your filters or search terms.</p>
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchFilters({
                  searchQuery: '',
                  location: '',
                  radius: 25,
                  salaryMin: '',
                  salaryMax: '',
                  jobType: [],
                  companySize: '',
                  industry: '',
                  datePosted: '',
                  experienceLevel: '',
                  skills: '',
                  remoteWork: ''
                });
              }}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* No Jobs Available */}
      {jobs.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">No jobs available</h3>
          <p className="mt-1">Check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-gray-500">You haven't applied to any jobs yet.</p>
          <div className="mt-6">
            <button onClick={() => setActiveTab('jobs')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Browse Jobs
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">Application #{index + 1}</h4>
                  <p className="text-gray-600">Job ID: {app.jobId}</p>
                  <p className="text-sm text-gray-500">Applied on: {app.appliedDate}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  app.status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Resume: {app.resumeFile}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



  const renderEditJobModal = () => {
    if (!showEditModal || !editingJob) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Job</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const jobData = {
                title: form.title.value,
                company: form.company.value,
                location: form.location.value,
                experience: form.experience.value,
                skills: form.skills.value.split(',').map(skill => skill.trim()),
                description: form.description.value,
                salaryRange: form.salaryRange?.value || '',
                jobType: form.jobType?.value || 'full-time'
              };
              handleEditJobSubmit(jobData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingJob.title}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  defaultValue={editingJob.company}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingJob.location}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                <select
                  name="experience"
                  defaultValue={editingJob.experience}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-4 years">2-4 years</option>
                  <option value="4+ years">4+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  defaultValue={Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : editingJob.skills}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range (Optional)</label>
                <input
                  type="text"
                  name="salaryRange"
                  defaultValue={editingJob.salary_range || ''}
                  placeholder="e.g., $50,000 - $70,000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="jobType"
                  defaultValue={editingJob.job_type || 'full-time'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  name="description"
                  defaultValue={editingJob.description}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderRecruiterJobs = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">YOUR FREELANCING SERVICE</h2>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setActiveTab('post-job')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Post New Service
        </button>
        <button
          onClick={loadRecruiterJobs}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Services'}
        </button>
      </div>

      {recruiterJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No services posted yet</h3>
        <p className="mt-1 text-gray-500">Get started by posting your first freelancing service.</p>
        <div className="mt-6">
          <button
            onClick={() => setActiveTab('post-job')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Post Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recruiterJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-blue-600">{job.title}</h4>
                <button
                  onClick={() => handleDeleteJob(job.id, job.title)}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-700 font-medium">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location} | {job.experience}</p>
              {job.salary_range && (
                <p className="text-sm text-green-600 font-medium">💰 {job.salary_range}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Posted: {new Date(job.created_at).toLocaleDateString()}
              </p>
              <div className="mt-3 mb-4">
                {(Array.isArray(job.skills) ? job.skills : job.skills?.split(',') || []).map((skill, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                    {skill.trim()}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {job.job_type || 'Full Time'}
                </span>
                <button
                  onClick={() => setActiveTab('recruiter-applications')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPostJob = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">POST A NEW FREELANCING SERVICE</h2>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl mx-auto">
        <form onSubmit={handlePostJob} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Professional Web Development Services"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Mobile Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              required
              placeholder="e.g., +1 (555) 123-4567"
              pattern="[+]?[0-9\s\-\(\)]+"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g., your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Freelancer/Company Name</label>
            <input
              type="text"
              name="company"
              required
              placeholder="e.g., Your Name or Company Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Location</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., Remote, New York, NY, or Worldwide"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <select name="experience" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select your experience level</option>
              <option value="Entry Level">Entry Level (0-1 years)</option>
              <option value="1-2 years">Intermediate (1-2 years)</option>
              <option value="2-4 years">Experienced (2-4 years)</option>
              <option value="4+ years">Expert (4+ years)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills & Expertise (comma separated)</label>
            <input
              type="text"
              name="skills"
              required
              placeholder="e.g., JavaScript, React, Node.js, UI/UX Design"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Rate (Optional)</label>
            <input
              type="text"
              name="salaryRange"
              placeholder="e.g., $25/hour, $500/project, or $50,000/year"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select name="jobType" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="hourly">Hourly Rate</option>
              <option value="project">Project-Based</option>
              <option value="contract">Long-term Contract</option>
              <option value="consultation">Consultation</option>
            </select>
          </div>

          {/* Resume Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume/CV</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload your resume</span>
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file type
                          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                          if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
                            alert('Please upload a PDF, DOC, or DOCX file.');
                            e.target.value = '';
                            return;
                          }
                          // Validate file size (5MB limit)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size must be less than 5MB.');
                            e.target.value = '';
                            return;
                          }
                          // Update UI to show selected file
                          const fileInfo = e.target.parentElement.parentElement.querySelector('.file-info');
                          if (fileInfo) {
                            fileInfo.textContent = `Selected: ${file.name}`;
                          }
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                <p className="file-info text-sm text-green-600"></p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
            <textarea
              name="description"
              required
              rows="6"
              placeholder="Describe your freelancing services, what you offer, your approach, and what makes you unique..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
            >
              {loading ? 'Posting Service...' : 'Post Freelancing Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setLoading(true);
      await applicationsAPI.updateStatus(applicationId, newStatus);
      alert('Application status updated successfully!');
      loadRecruiterApplications(); // Reload applications
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async (filename) => {
    try {
      const response = await applicationsAPI.downloadResume(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume');
    }
  };

  const renderRecruiterApplications = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">SERVICE APPLICATIONS</h2>
      <div className="mb-4">
        <button
          onClick={loadRecruiterApplications}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Applications'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recruiterApplications.length > 0 ? (
                recruiterApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={loading}
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {app.resume_filename && (
                          <button
                            onClick={() => handleDownloadResume(app.resume_filename)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Download Resume
                          </button>
                        )}
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">Phone: {app.phone || 'N/A'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading applications...' : 'No applications received yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { isLogin, formData });

    // Prevent double submission
    if (loading) {
      console.log('Form submission already in progress, ignoring...');
      return;
    }

    // Clear any existing errors
    setError('');

    // Client-side validation
    if (!isLogin) {
      // Registration validation
      if (!formData.email.trim()) {
        setError('Email is required for registration');
        return;
      }
      if (!formData.password.trim()) {
        setError('Password is required for registration');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (!formData.fullName.trim()) {
        setError('Full name is required for registration');
        return;
      }
      if (formData.userType === 'recruiter' && !formData.companyName.trim()) {
        setError('Business/Company name is required for freelancers');
        return;
      }
    } else {
      // Login validation
      if (!formData.email.trim()) {
        setError('Email is required for login');
        return;
      }
      if (!formData.password.trim()) {
        setError('Password is required for login');
        return;
      }
    }

    try {
      if (isLogin) {
        await handleLogin(formData.email, formData.password);
      } else {
        await handleRegister(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is already handled in handleLogin/handleRegister
    }
  };

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    console.log('Form data updated:', newFormData);
    setFormData(newFormData);
  };

  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      userType: 'jobseeker',
      companyName: ''
    });
  };

  const renderLoginPage = () => {

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back to Landing Page Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowLandingPage(true)}
              className="flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password {!isLogin && <span className="text-xs text-gray-500">(minimum 6 characters)</span>}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={!isLogin ? 6 : undefined}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-
                />
                {!
                {!isLogin && formData.password && formData.password.length < 6 && (
                  <p className="mt-1 text-sm text-red-600">Password must be at least 6 characters long</p>
                )}
              </div>
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Account Type</label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="jobseeker">Client</option>
                      <option value="recruiter">Freelancer</option>
                    </select>
                  </div>
                  {formData.userType === 'recruiter' && (
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Business/Company Name</label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  )}
                </>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleLoginMode}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderNav = () => {
    return (
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mr-8`}>
                FREELANCER MARKET PLACE
              </h1>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <div className="flex">
                  <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`${
                        activeTab === 'dashboard'
                          ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                          : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      DASHBOARD
                    </button>

                    {user?.userType === 'jobseeker' && (
                      <>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className={`${
                            activeTab === 'profile'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          PROFILE
                        </button>
                        <button
                          onClick={() => setActiveTab('jobs')}
                          className={`${
                            activeTab === 'jobs'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          Jobs
                        </button>
                        <button
                          onClick={() => setActiveTab('saved-jobs')}
                          className={`${
                            activeTab === 'saved-jobs'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          Saved ({savedJobs.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('applications')}
                          className={`${
                            activeTab === 'applications'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          Applications
                        </button>
                      </>
                    )}

                    {user?.userType === 'recruiter' && (
                      <>
                        <button
                          onClick={() => setActiveTab('recruiter-jobs')}
                          className={`${
                            activeTab === 'recruiter-jobs'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          MY SERVICES
                        </button>
                        <button
                          onClick={() => setActiveTab('post-job')}
                          className={`${
                            activeTab === 'post-job'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          POST SERVICE
                        </button>
                        <button
                          onClick={() => setActiveTab('recruiter-applications')}
                          className={`${
                            activeTab === 'recruiter-applications'
                              ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                              : `border-transparent ${darkMode ? 'text-gray-300 hover:text-white hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          APPLICATIONS
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right side - User info and actions */}
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === 'notifications'
                          ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600')
                          : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')
                      }`}
                      title="Notifications"
                    >
                      🔔
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* User greeting */}
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Welcome, {user?.fullName}
                  </span>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-300 ${
                      darkMode
                        ? 'text-white bg-red-700 hover:bg-red-600'
                        : 'text-white bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please login to access all features
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };

  // Render Saved Jobs
  const renderSavedJobs = () => (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>No saved jobs yet</h3>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Save jobs you're interested in to view them here.</p>
          <div className="mt-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map(job => (
            <div key={job.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-6 border hover:shadow-lg transition-all duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <h4 className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{job.title}</h4>
                <button
                  onClick={() => toggleSaveJob(job)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Remove from saved"
                >
                  ❤️
                </button>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{job.company}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{job.location} | {job.experience}</p>
              <div className="mt-3 mb-4">
                {job.skills.map((skill, index) => (
                  <span key={index} className={`inline-block ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded-full mr-2 mb-2`}>
                    {skill}
                  </span>
                ))}
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>{job.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleJobApply(job.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  {loading ? 'Applying...' : 'Apply Now'}
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-4 py-2 rounded-md transition-colors duration-200`}
                >
                  View All Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Notifications
  const renderNotifications = () => (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {notifications.length === 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5zM7 7h10v10H7V7z" />
          </svg>
          <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>No notifications</h3>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You're all caught up! Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-4 border transition-all duration-300`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{notification.message}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  notification.type === 'success' ? 'bg-green-100 text-green-800' :
                  notification.type === 'error' ? 'bg-red-100 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {notification.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Show landing page for new visitors
  if (showLandingPage && !isAuthenticated) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLandingPage(false);
          setIsLogin(false); // Show registration form
          setError(''); // Clear any existing errors
          setFormData({
            email: '',
            password: '',
            fullName: '',
            userType: 'jobseeker',
            companyName: ''
          }); // Reset form data
        }}
        onLogin={() => {
          setShowLandingPage(false);
          setIsLogin(true); // Show login form
          setError(''); // Clear any existing errors
          setFormData({
            email: '',
            password: '',
            fullName: '',
            userType: 'jobseeker',
            companyName: ''
          }); // Reset form data
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return renderLoginPage();
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      {renderNav()}
      <main>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'saved-jobs' && renderSavedJobs()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'recruiter-jobs' && renderRecruiterJobs()}
        {activeTab === 'post-job' && renderPostJob()}
        {activeTab === 'recruiter-applications' && renderRecruiterApplications()}
      </main>
      {renderEditJobModal()}
    </div>
  );
}