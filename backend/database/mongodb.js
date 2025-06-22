const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    console.log('🔄 Attempting MongoDB connection...');
    console.log('📍 MongoDB URI configured:', process.env.MONGODB_URI ? 'Yes' : 'No');

    // Set mongoose options for better stability
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // 15 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 15000, // 15 second connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('❌ Full error:', error);

    // Don't exit immediately, let the caller handle it
    throw error;
  }
};

module.exports = connectDB;
