console.log('Starting simple server...');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

console.log('Setting up middleware...');

// More permissive CORS for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Setting up routes...');

app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', message: 'Simple server is running' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  
  if (email === 'manishmodi0408@gmail.com' && password === '987654') {
    res.json({
      message: 'Login successful',
      token: 'test-token',
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
      token: 'test-token',
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
  console.log('Register request:', req.body);
  const { email, password, userType, fullName, companyName } = req.body;
  
  res.status(201).json({
    message: 'User created successfully',
    token: 'test-token',
    user: {
      id: Date.now().toString(),
      email: email,
      userType: userType,
      fullName: fullName,
      companyName: companyName
    }
  });
});

console.log('Starting server...');

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`✅ Server is ready to accept connections`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

console.log('Server setup complete.');
