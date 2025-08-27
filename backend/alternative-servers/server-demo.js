const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mock data for demonstration
let users = [
  {
    id: '1',
    email: 'manishmodi0408@gmail.com',
    password: '$2a$10$hashedpassword', // This would be hashed in real app
    fullName: 'Manish Modi',
    userType: 'recruiter',
    companyName: 'Tech Solutions'
  },
  {
    id: '2',
    email: 'john@example.com',
    password: '$2a$10$hashedpassword',
    fullName: 'John Doe',
    userType: 'jobseeker'
  }
];

let jobs = [
  {
    id: '1',
    title: 'Full Stack Web Development Services',
    company: 'Freelance Pro',
    location: 'Remote',
    experience: '2-4 years',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    description: 'Professional full-stack web development services for modern applications.',
    salary_range: '$50/hour',
    job_type: 'hourly',
    recruiter_id: '1',
    mobile: '+1 555 123 4567',
    email: 'contact@freelancepro.com',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'UI/UX Design Services',
    company: 'Design Studio',
    location: 'New York, NY',
    experience: '1-2 years',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design'],
    description: 'Creative UI/UX design services for web and mobile applications.',
    salary_range: '$40/hour',
    job_type: 'project',
    recruiter_id: '1',
    mobile: '+1 555 987 6543',
    email: 'design@studio.com',
    created_at: new Date().toISOString()
  }
];

let applications = [];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple authentication (in real app, use bcrypt)
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // For demo, accept any password for existing users
  const token = 'demo-jwt-token-' + user.id;
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      companyName: user.companyName
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, userType, companyName } = req.body;
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    email,
    password: '$2a$10$hashedpassword', // Would be hashed in real app
    fullName,
    userType,
    companyName: companyName || null
  };
  
  users.push(newUser);
  
  const token = 'demo-jwt-token-' + newUser.id;
  
  res.json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      userType: newUser.userType,
      companyName: newUser.companyName
    }
  });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: String(jobs.length + 1),
    ...req.body,
    recruiter_id: '1', // Demo user
    created_at: new Date().toISOString()
  };
  
  jobs.push(newJob);
  res.json(newJob);
});

app.delete('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  jobs = jobs.filter(job => job.id !== jobId);
  res.json({ message: 'Job deleted successfully' });
});

// Application routes
app.get('/api/applications/my', (req, res) => {
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const newApplication = {
    id: String(applications.length + 1),
    ...req.body,
    applied_date: new Date().toISOString(),
    status: 'applied'
  };
  
  applications.push(newApplication);
  res.json(newApplication);
});

// User routes
app.get('/api/users/profile', (req, res) => {
  res.json({
    full_name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1 555 123 4567',
    location: 'Demo City',
    skills: 'JavaScript, React, Node.js',
    experience_level: '2-4',
    bio: 'Demo user profile'
  });
});

app.put('/api/users/profile', (req, res) => {
  res.json({ message: 'Profile updated successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Demo Freelancer Marketplace API is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Demo Freelancer Marketplace Server Started!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log('🎯 Demo Mode - No MongoDB required');
  console.log('');
  console.log('📋 Demo Credentials:');
  console.log('   Email: manishmodi0408@gmail.com');
  console.log('   Password: any password (demo mode)');
  console.log('');
  console.log('✅ Ready to receive requests!');
});
