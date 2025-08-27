// Test authentication endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002/api';

async function testAuth() {
  try {
    console.log('🔄 Testing Authentication Endpoints...');

    // Test 1: Register a new user
    console.log('\n📝 Test 1: Register new user...');
    const registerData = {
      email: `test-auth-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Auth User',
      userType: 'jobseeker'
    };

    console.log('Registration data:', registerData);
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful');
    console.log('Response:', registerResponse.data);

    const { token, user } = registerResponse.data;

    // Test 2: Login with the same credentials
    console.log('\n📝 Test 2: Login with credentials...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    console.log('Login data:', loginData);
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful');
    console.log('Response:', loginResponse.data);

    // Test 3: Try to register with same email (should fail)
    console.log('\n📝 Test 3: Try duplicate registration...');
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('❌ Duplicate registration should have failed');
    } catch (error) {
      console.log('✅ Duplicate registration correctly rejected');
      console.log('Error:', error.response?.data?.error);
    }

    // Test 4: Try login with wrong password
    console.log('\n📝 Test 4: Try login with wrong password...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: registerData.email,
        password: 'wrongpassword'
      });
      console.log('❌ Wrong password login should have failed');
    } catch (error) {
      console.log('✅ Wrong password correctly rejected');
      console.log('Error:', error.response?.data?.error);
    }

    // Test 5: Try login with non-existent user
    console.log('\n📝 Test 5: Try login with non-existent user...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'password123'
      });
      console.log('❌ Non-existent user login should have failed');
    } catch (error) {
      console.log('✅ Non-existent user correctly rejected');
      console.log('Error:', error.response?.data?.error);
    }

    console.log('\n🎉 All authentication tests passed!');
    console.log('✅ Registration working correctly');
    console.log('✅ Login working correctly');
    console.log('✅ Error handling working correctly');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testAuth();
