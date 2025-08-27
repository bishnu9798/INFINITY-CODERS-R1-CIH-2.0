const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3002; // Fixed port for testing

console.log('🔄 Starting test auth server...');

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Test auth server is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  
  // Test with known credentials
  if (email === 'manishmodi0408@gmail.com' && password === '987654') {
    res.json({
      message: 'Login successful',
      token: 'test-token-recruiter',
      user: {
        id: '1',
        email: email,
        userType: 'recruiter',
        fullName: 'Manish Modi',
        companyName: 'The Tech World'
      }
    });
  } else if (email === 'manish1@gmail.com' && password === '123456') {
    res.json({
      message: 'Login successful',
      token: 'test-token-jobseeker',
      user: {
        id: '2',
        email: email,
        userType: 'jobseeker',
        fullName: 'Manish Kumar'
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  const { email, password, userType, fullName, companyName } = req.body;
  
  res.status(201).json({
    message: 'User created successfully',
    token: 'test-token-new-user',
    user: {
      id: Date.now().toString(),
      email: email,
      userType: userType,
      fullName: fullName,
      companyName: companyName
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Test auth server running on http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`✅ Ready for authentication testing`);
});

console.log('✅ Server setup complete');
