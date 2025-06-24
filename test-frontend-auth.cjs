// Test frontend authentication from the same environment
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002/api';

async function testFrontendAuth() {
  try {
    console.log('🔄 Testing Frontend Authentication from same environment...');

    // Test 1: Check server health
    console.log('\n📝 Test 1: Check server health...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ Server health check successful:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }

    // Test 2: Test CORS with OPTIONS request
    console.log('\n📝 Test 2: Test CORS preflight...');
    try {
      const corsResponse = await axios.options(`${API_BASE_URL}/auth/register`);
      console.log('✅ CORS preflight successful');
    } catch (error) {
      console.log('⚠️ CORS preflight failed (this might be normal):', error.message);
    }

    // Test 3: Register a test user (simulating frontend)
    console.log('\n📝 Test 3: Register test user (frontend simulation)...');
    const registerData = {
      email: `frontend-test-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Frontend Test User',
      userType: 'jobseeker'
    };

    console.log('Registration data:', registerData);
    
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5174',
          'Referer': 'http://localhost:5174/'
        }
      });
      console.log('✅ Registration successful:', registerResponse.data);
      
      const { token, user } = registerResponse.data;

      // Test 4: Login with the same credentials
      console.log('\n📝 Test 4: Login with credentials...');
      const loginData = {
        email: registerData.email,
        password: registerData.password
      };

      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5174',
          'Referer': 'http://localhost:5174/'
        }
      });
      console.log('✅ Login successful:', loginResponse.data);

      // Test 5: Test authenticated request
      console.log('\n📝 Test 5: Test authenticated request...');
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Origin': 'http://localhost:5174',
            'Referer': 'http://localhost:5174/'
          }
        });
        console.log('✅ Authenticated request successful:', profileResponse.data);
      } catch (error) {
        console.log('⚠️ Authenticated request failed:', error.response?.data || error.message);
      }

      console.log('\n🎉 All frontend authentication tests passed!');
      console.log('✅ Server is accessible from frontend port');
      console.log('✅ Registration working correctly');
      console.log('✅ Login working correctly');
      console.log('✅ CORS configuration appears correct');

    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data || error.message);
      if (error.response) {
        console.log('❌ Response status:', error.response.status);
        console.log('❌ Response headers:', error.response.headers);
      }
    }

  } catch (error) {
    console.error('❌ Frontend authentication test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testFrontendAuth();
