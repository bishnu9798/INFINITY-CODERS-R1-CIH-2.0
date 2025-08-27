const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const verifyFix = async () => {
  console.log('🔍 VERIFYING AUTHENTICATION FIX...\n');
  
  // Step 1: Test MongoDB Connection
  console.log('1️⃣ Testing MongoDB Connection...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}\n`);
    
    // Check if users exist
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`📊 Users in database: ${userCount}`);
    
    // Check for test users
    const testRecruiter = await User.findOne({ email: 'manishmodi0408@gmail.com' });
    const testJobseeker = await User.findOne({ email: 'manish1@gmail.com' });
    
    console.log(`   Recruiter (manishmodi0408@gmail.com): ${testRecruiter ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Job Seeker (manish1@gmail.com): ${testJobseeker ? '✅ Found' : '❌ Not found'}\n`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('   Error:', error.message);
    return false;
  }
  
  // Step 2: Test Backend Server
  console.log('2️⃣ Testing Backend Server...');
  try {
    const healthResponse = await axios.get('http://localhost:3002/api/health');
    console.log('✅ Backend Server is running');
    console.log(`   Status: ${healthResponse.data.status}\n`);
  } catch (error) {
    console.error('❌ Backend Server not accessible');
    console.error('   Make sure server is running on port 3002\n');
    return false;
  }
  
  // Step 3: Test Authentication
  console.log('3️⃣ Testing Authentication...');
  try {
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'manishmodi0408@gmail.com',
      password: '987654'
    });
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log('✅ Authentication Working!');
      console.log(`   User: ${loginResponse.data.user.full_name}`);
      console.log(`   Type: ${loginResponse.data.user.userType}`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...\n`);
      
      // Test token validation
      const profileResponse = await axios.get('http://localhost:3002/api/users/profile', {
        headers: { Authorization: `Bearer ${loginResponse.data.token}` }
      });
      console.log('✅ Token validation working!\n');
      
    } else {
      console.error('❌ Authentication failed - Invalid response');
      return false;
    }
  } catch (error) {
    console.error('❌ Authentication Failed:');
    console.error('   Error:', error.response?.data?.error || error.message);
    return false;
  }
  
  console.log('🎉 ALL TESTS PASSED! Sign-in should work now.\n');
  console.log('📋 Test Credentials:');
  console.log('   Recruiter:   manishmodi0408@gmail.com / 987654');
  console.log('   Job Seeker:  manish1@gmail.com / 123456');
  
  return true;
};

verifyFix().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
