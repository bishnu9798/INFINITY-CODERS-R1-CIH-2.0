import axios from 'axios';

async function finalStatusCheck() {
  console.log('🔍 FINAL SYSTEM STATUS CHECK\n');
  console.log('=' .repeat(50));
  
  let allGood = true;

  try {
    // 1. Check Frontend
    console.log('1️⃣ FRONTEND CHECK');
    try {
      const frontendResponse = await axios.get('http://localhost:5173/');
      if (frontendResponse.status === 200 && frontendResponse.data.includes('html')) {
        console.log('✅ Frontend: RUNNING on http://localhost:5173/');
      } else {
        console.log('❌ Frontend: RESPONDING but content issue');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Frontend: NOT ACCESSIBLE');
      console.log('   Error:', error.message);
      allGood = false;
    }

    // 2. Check Backend
    console.log('\n2️⃣ BACKEND CHECK');
    try {
      const backendResponse = await axios.get('http://localhost:3002/api/health');
      if (backendResponse.status === 200) {
        console.log('✅ Backend: RUNNING on http://localhost:3002');
        console.log('   Message:', backendResponse.data.message);
      } else {
        console.log('❌ Backend: RESPONDING but health check failed');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Backend: NOT ACCESSIBLE');
      console.log('   Error:', error.message);
      allGood = false;
    }

    // 3. Check Authentication
    console.log('\n3️⃣ AUTHENTICATION CHECK');
    try {
      const authResponse = await axios.post('http://localhost:3002/api/auth/login', {
        email: 'manishmodi0408@gmail.com',
        password: '987654'
      });
      if (authResponse.status === 200 && authResponse.data.token) {
        console.log('✅ Authentication: WORKING');
        console.log('   User:', authResponse.data.user.full_name);
        console.log('   Type:', authResponse.data.user.user_type);
      } else {
        console.log('❌ Authentication: LOGIN FAILED');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Authentication: ERROR');
      console.log('   Error:', error.response?.data?.error || error.message);
      allGood = false;
    }

    // 4. Check Jobs API
    console.log('\n4️⃣ JOBS API CHECK');
    try {
      const jobsResponse = await axios.get('http://localhost:3002/api/jobs');
      if (jobsResponse.status === 200) {
        console.log('✅ Jobs API: WORKING');
        console.log('   Total Jobs:', jobsResponse.data.length);
        if (jobsResponse.data.length > 0) {
          console.log('   Sample Job:', jobsResponse.data[0].title);
        }
      } else {
        console.log('❌ Jobs API: FAILED');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Jobs API: ERROR');
      console.log('   Error:', error.message);
      allGood = false;
    }

    // 5. Check Database Connection
    console.log('\n5️⃣ DATABASE CHECK');
    try {
      // Test by trying to register a user (this will test MongoDB)
      const testUser = {
        email: `statuscheck${Date.now()}@test.com`,
        password: 'test123',
        fullName: 'Status Check User',
        userType: 'jobseeker'
      };
      
      const dbResponse = await axios.post('http://localhost:3002/api/auth/register', testUser);
      if (dbResponse.status === 201 && dbResponse.data.user) {
        console.log('✅ Database: CONNECTED and WORKING');
        console.log('   New User Created:', dbResponse.data.user._id);
      } else {
        console.log('❌ Database: REGISTRATION FAILED');
        allGood = false;
      }
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('✅ Database: CONNECTED (duplicate user test)');
      } else {
        console.log('❌ Database: ERROR');
        console.log('   Error:', error.response?.data?.error || error.message);
        allGood = false;
      }
    }

    // Final Status
    console.log('\n' + '=' .repeat(50));
    if (allGood) {
      console.log('🎉 SYSTEM STATUS: ALL SYSTEMS OPERATIONAL!');
      console.log('\n📋 READY TO USE:');
      console.log('🌐 Frontend: http://localhost:5173/');
      console.log('🔧 Backend: http://localhost:3002/');
      console.log('🔑 Your Accounts:');
      console.log('   Recruiter: manishmodi0408@gmail.com / 987654');
      console.log('   Job Seeker: manish1@gmail.com / 123456');
      console.log('\n✨ Your job portal is ready to use!');
    } else {
      console.log('⚠️ SYSTEM STATUS: SOME ISSUES DETECTED');
      console.log('Please check the errors above and restart the affected services.');
    }

  } catch (error) {
    console.error('❌ Status check failed:', error.message);
  }
}

finalStatusCheck();
