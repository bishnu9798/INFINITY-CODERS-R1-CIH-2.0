const axios = require('axios');

const API_BASE = 'http://127.0.0.1:3002/api';

async function debugJobPosting() {
  try {
    console.log('🔍 Debugging Job Posting Issue...\n');

    // Step 1: Check if backend is running
    console.log('1️⃣ Checking backend health...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Backend is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
      console.log('💡 Make sure the backend server is running on port 3002');
      return;
    }

    // Step 2: Test login with recruiter account
    console.log('\n2️⃣ Testing recruiter login...');
    let token;
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'manishmodi0408@gmail.com',
        password: '987654'
      });
      
      if (loginResponse.data.token) {
        token = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log('   User:', loginResponse.data.user.fullName);
        console.log('   Type:', loginResponse.data.user.userType);
        console.log('   Token:', token.substring(0, 20) + '...');
      } else {
        console.log('❌ Login failed - no token received');
        return;
      }
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
      return;
    }

    // Step 3: Test job posting
    console.log('\n3️⃣ Testing job posting...');
    const jobData = {
      title: 'Test Frontend Developer',
      company: 'Test Company',
      location: 'Remote',
      experience: '2+ years',
      skills: 'React, JavaScript, CSS',
      description: 'This is a test job posting to debug the issue.',
      salaryRange: '$60,000 - $80,000',
      jobType: 'full-time'
    };

    console.log('Job data to post:', JSON.stringify(jobData, null, 2));

    try {
      const jobResponse = await axios.post(`${API_BASE}/jobs`, jobData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Job posted successfully!');
      console.log('   Job ID:', jobResponse.data.jobId);
      console.log('   Response:', jobResponse.data);

    } catch (error) {
      console.log('❌ Job posting failed!');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data);
      console.log('   Full error:', error.message);
      
      // Additional debugging
      if (error.response?.status === 401) {
        console.log('\n🔍 Authentication issue detected:');
        console.log('   - Token might be invalid or expired');
        console.log('   - Check JWT_SECRET in backend/.env');
      } else if (error.response?.status === 403) {
        console.log('\n🔍 Authorization issue detected:');
        console.log('   - User might not be a recruiter');
        console.log('   - Check user type in database');
      } else if (error.response?.status === 400) {
        console.log('\n🔍 Validation issue detected:');
        console.log('   - Check required fields');
        console.log('   - Validation errors:', error.response?.data?.errors);
      } else if (error.response?.status === 500) {
        console.log('\n🔍 Server error detected:');
        console.log('   - Check backend logs');
        console.log('   - Database connection might be down');
      }
    }

    // Step 4: Test getting jobs
    console.log('\n4️⃣ Testing job retrieval...');
    try {
      const jobsResponse = await axios.get(`${API_BASE}/jobs`);
      console.log('✅ Jobs retrieved successfully');
      console.log('   Total jobs:', jobsResponse.data.length);
    } catch (error) {
      console.log('❌ Failed to retrieve jobs:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

// Run the debug
debugJobPosting();
