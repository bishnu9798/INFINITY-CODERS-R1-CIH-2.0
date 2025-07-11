const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const connectDB = require('./database/mongodb.js');
const authRoutes = require('./routes/auth.js');
const servicesRoutes = require('./routes/services.js');
const applicationRoutes = require('./routes/applications.js');
const userRoutes = require('./routes/users.js');
const realTimeService = require('./services/realTimeService.js');
const websocketServer = require('./services/websocketServer.js');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// __dirname is available in CommonJS

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
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
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Static files for uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Job Portal API is running' });
});

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

// WebSocket info endpoint
app.get('/api/websocket/info', (req, res) => {
  const wsStats = websocketServer.getStats();
  const changeStreamsInfo = realTimeService.getChangeStreamsInfo();
  res.json({
    websocket: wsStats,
    changeStreams: changeStreamsInfo
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with MongoDB connection
const startServer = async () => {
  console.log('🚀 Starting Freelancer-market-place Server...');
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  console.log('📍 Port:', PORT);

  try {
    // Add timeout for MongoDB connection
    console.log('🔄 Connecting to MongoDB...');
    const connectionPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout after 20 seconds')), 20000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ MongoDB connection successful');

    // Initialize real-time services
    console.log('🔄 Initializing real-time services...');
    await realTimeService.initializeChangeStreams();
    console.log('✅ Real-time services initialized');

    // Create HTTP server
    console.log('🔄 Creating HTTP server...');
    const server = http.createServer(app);

    // Initialize WebSocket server
    console.log('🔄 Initializing WebSocket server...');
    websocketServer.initialize(server);
    console.log('✅ WebSocket server initialized');

    // Start the HTTP server
    console.log('🔄 Starting HTTP server...');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`📈 Real-time Stats: http://localhost:${PORT}/api/stats`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📁 Current directory: ${process.cwd()}`);
      console.log(`🌐 CORS enabled for: http://localhost:5173, 5174, 5175`);
      console.log(`⚡ Ready to receive requests!`);
      console.log('');
      console.log('🎯 Test the server:');
      console.log(`   curl http://localhost:${PORT}/api/health`);
      console.log(`   curl http://localhost:${PORT}/api/stats`);
      console.log('');
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is in use. Please check for other running processes.`);
        console.log('💡 Try: netstat -ano | findstr :' + PORT);
        process.exit(1);
      }
    });

    server.on('listening', () => {
      console.log('✅ Server is listening and ready');
    });

    // Handle server shutdown gracefully
    const gracefulShutdown = async () => {
      console.log('\n🔄 Received shutdown signal, closing server gracefully...');

      // Close WebSocket server
      websocketServer.close();

      // Close change streams
      await realTimeService.closeChangeStreams();

      // Close HTTP server
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

    if (error.message.includes('timeout')) {
      console.log('💡 MongoDB connection timed out. Please check:');
      console.log('   1. Internet connection');
      console.log('   2. MongoDB Atlas cluster status');
      console.log('   3. Network firewall settings');
    }

    process.exit(1);
  }
};

startServer();
