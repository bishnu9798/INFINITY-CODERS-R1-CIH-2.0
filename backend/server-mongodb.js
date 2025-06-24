const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3002;

console.log('🚀 Starting Freelancer-market-place Server with MongoDB...');
console.log('📍 Port:', PORT);

// Basic middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
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

// Health check endpoint (available immediately)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Freelancer-market-place API is running with MongoDB',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB first
    console.log('🔄 Connecting to MongoDB...');
    const connectDB = require('./database/mongodb.js');
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Load routes after MongoDB connection
    console.log('🔄 Loading routes...');
    const authRoutes = require('./routes/auth.js');
    const servicesRoutes = require('./routes/services.js');
    const applicationRoutes = require('./routes/applications.js');
    const userRoutes = require('./routes/users.js');

    // Setup routes
    app.use('/api/auth', authRoutes);
    app.use('/api/services', servicesRoutes);
    app.use('/api/applications', applicationRoutes);
    app.use('/api/users', userRoutes);
    console.log('✅ Routes loaded successfully');

    // Initialize real-time services
    console.log('🔄 Initializing real-time services...');
    const realTimeService = require('./services/realTimeService.js');
    await realTimeService.initializeChangeStreams();
    console.log('✅ Real-time services initialized');

    // Real-time stats endpoint
    app.get('/api/stats', async (req, res) => {
      try {
        const stats = await realTimeService.getRealTimeStats();
        res.json(stats);
      } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
      }
    });

    // Static files for uploaded resumes
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('❌ Server error:', err.stack);
      res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Start HTTP server
    console.log('🔄 Starting HTTP server...');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🎉 ===== FREELANCER-MARKET-PLACE SERVER READY =====');
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend: http://localhost:5173`);
      console.log(`🗄️ Database: MongoDB Atlas Connected`);
      console.log('');
      console.log('🔑 Test Credentials:');
      console.log('   Recruiter: manishmodi0408@gmail.com / 987654');
      console.log('   Job Seeker: manish1@gmail.com / 123456');
      console.log('');
      console.log('⚡ Ready to receive requests!');
      console.log('=====================================');
      console.log('');
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is in use. Trying to kill existing process...`);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n🔄 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
