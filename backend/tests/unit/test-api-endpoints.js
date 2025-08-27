const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPIEndpoints() {
  console.log('🔄 Testing Job Portal API Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);

    // Test 2: Register a new user
    console.log('\n2. Testing User Registration...');
    const registerData = {
      email: 'testuser@example.com',
      password: 'testpassword123',
      userType: 'jobseeker',
      fullName: 'Test User'
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      console.log('✅ User Registration:', registerResponse.data.message);
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('✅ User Registration: User already exists (expected)');
      } else {
        throw error;
      }
    }

    // Test 3: Login
    console.log('\n3. Testing User Login...');
    const loginData = {
      email: 'testuser@example.com',
      password: 'testpassword123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ User Login:', loginResponse.data.message);
    const token = loginResponse.data.token;

    // Test 4: Get User Profile
    console.log('\n4. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ User Profile:', profileResponse.data.full_name);

    // Test 5: Get Jobs
    console.log('\n5. Testing Get Jobs...');
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ Get Jobs:', `Found ${jobsResponse.data.length} jobs`);

    // Test 6: Get User Stats
    console.log('\n6. Testing User Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ User Stats:', statsResponse.data);

    console.log('\n🎉 All API endpoint tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Only run if server is running
testAPIEndpoints();
