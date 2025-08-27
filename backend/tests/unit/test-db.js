const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3003; // Use different port to avoid conflicts

console.log('🔄 Starting test server...');
console.log('Port:', PORT);
console.log('Environment:', process.env.NODE_ENV);

// Middleware
console.log('Setting up CORS...');
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('Setting up JSON middleware...');
app.use(express.json());

console.log('Setting up routes...');
// Test routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server is running' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);

  // Mock successful login
  const { email, password } = req.body;

  if (email === 'manishmodi0408@gmail.com' && password === '987654') {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
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
      token: 'mock-jwt-token',
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
  console.log('Registration attempt:', req.body);

  const { email, password, userType, fullName, companyName } = req.body;

  // Mock successful registration
  res.status(201).json({
    message: 'User created successfully',
    token: 'mock-jwt-token',
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
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
console.log('Starting server on port', PORT);
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Ready to receive requests!`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
