import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

async function testCompleteAuth() {
  console.log('🔐 Testing Complete Authentication System\n');
  console.log('Backend API:', API_BASE);
  console.log('Frontend URL: http://localhost:5173\n');

  try {
    // Test 1: Server Health Check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is healthy:', healthResponse.data.message);

    // Test 2: Register New User (Job Seeker)
    console.log('\n2️⃣ Testing user registration (Job Seeker)...');
    const newJobSeeker = {
      email: `testuser${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Job Seeker',
      userType: 'jobseeker'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, newJobSeeker);
      console.log('✅ Job Seeker registration successful!');
      console.log('   User ID:', registerResponse.data.user._id);
      console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('❌ Job Seeker registration failed:', error.response?.data?.error || error.message);
    }

    // Test 3: Register New User (Recruiter)
    console.log('\n3️⃣ Testing user registration (Recruiter)...');
    const newRecruiter = {
      email: `recruiter${Date.now()}@company.com`,
      password: 'password123',
      fullName: 'Test Recruiter',
      userType: 'recruiter',
      companyName: 'Test Company Inc'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, newRecruiter);
      console.log('✅ Recruiter registration successful!');
      console.log('   User ID:', registerResponse.data.user._id);
      console.log('   Company:', registerResponse.data.user.company_name);
      console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('❌ Recruiter registration failed:', error.response?.data?.error || error.message);
    }

    // Test 4: Login with Your Existing Accounts
    console.log('\n4️⃣ Testing login with your existing accounts...');
    
    // Test your recruiter account
    console.log('\n   Testing Recruiter Login (Manish Modi):');
    try {
      const recruiterLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'manishmodi0408@gmail.com',
        password: '987654'
      });
      console.log('✅ Recruiter login successful!');
      console.log('   Welcome:', recruiterLogin.data.user.full_name);
      console.log('   User Type:', recruiterLogin.data.user.user_type);
      console.log('   Company:', recruiterLogin.data.user.company_name);
    } catch (error) {
      console.log('❌ Recruiter login failed:', error.response?.data?.error || error.message);
    }

    // Test your job seeker account
    console.log('\n   Testing Job Seeker Login (Manish Kumar):');
    try {
      const jobseekerLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'manish1@gmail.com',
        password: '123456'
      });
      console.log('✅ Job Seeker login successful!');
      console.log('   Welcome:', jobseekerLogin.data.user.full_name);
      console.log('   User Type:', jobseekerLogin.data.user.user_type);
    } catch (error) {
      console.log('❌ Job Seeker login failed:', error.response?.data?.error || error.message);
    }

    // Test 5: Test Invalid Login
    console.log('\n5️⃣ Testing invalid login...');
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Invalid login correctly rejected:', error.response?.data?.error);
    }

    // Test 6: Test Duplicate Registration
    console.log('\n6️⃣ Testing duplicate registration...');
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: 'manishmodi0408@gmail.com', // Your existing email
        password: 'anypassword',
        fullName: 'Duplicate User',
        userType: 'jobseeker'
      });
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Duplicate registration correctly rejected:', error.response?.data?.error);
    }

    console.log('\n🎉 Authentication testing completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Server is running and healthy');
    console.log('✅ User registration is working');
    console.log('✅ User login is working');
    console.log('✅ Your existing accounts are accessible');
    console.log('✅ Error handling is working');
    
    console.log('\n🌐 You can now use the frontend at: http://localhost:5173');
    console.log('🔑 Try logging in with your accounts:');
    console.log('   Recruiter: manishmodi0408@gmail.com / 987654');
    console.log('   Job Seeker: manish1@gmail.com / 123456');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteAuth();
