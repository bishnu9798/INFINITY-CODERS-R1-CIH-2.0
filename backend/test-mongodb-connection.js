const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    console.log('📍 Current IP should be whitelisted: 152.59.144.4');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }

    console.log('⏳ Attempting to connect...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📊 Ready State: ${conn.connection.readyState}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('   Message:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.codeName) {
      console.error('   Code Name:', error.codeName);
    }
    
    // Provide specific guidance for common errors
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🔧 SOLUTION:');
      console.error('   1. Go to MongoDB Atlas Dashboard');
      console.error('   2. Navigate to Network Access');
      console.error('   3. Add IP Address: 152.59.144.4');
      console.error('   4. Or add 0.0.0.0/0 for all IPs (less secure)');
    }
    
    process.exit(1);
  }
};

testConnection();
