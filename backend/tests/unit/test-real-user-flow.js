const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testRealUserFlow() {
  console.log('🔄 Testing Real User Flow (Creating Your Own Data)...\n');

  try {
    // Test 1: Register a new recruiter
    console.log('1. 👔 Registering a new recruiter...');
    const recruiterData = {
      email: 'myrecruiter@company.com',
      password: 'mypassword123',
      userType: 'recruiter',
      fullName: 'My Recruiter Name',
      companyName: 'My Company'
    };

    let recruiterToken;
    try {
      const recruiterResponse = await axios.post(`${BASE_URL}/auth/register`, recruiterData);
      console.log('✅ Recruiter registered:', recruiterResponse.data.message);
      recruiterToken = recruiterResponse.data.token;
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('ℹ️ Recruiter already exists, logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: recruiterData.email,
          password: recruiterData.password
        });
        recruiterToken = loginResponse.data.token;
        console.log('✅ Recruiter logged in successfully');
      } else {
        throw error;
      }
    }

    // Test 2: Create a job posting
    console.log('\n2. 💼 Creating a job posting...');
    const jobData = {
      title: 'My Custom Job Title',
      company: 'My Company',
      location: 'My City, My State',
      experience: '2-3 years',
      skills: ['JavaScript', 'React', 'Node.js'],
      description: 'This is my custom job description created through the API test.',
      salaryRange: '$60,000 - $80,000',
      jobType: 'full-time'
    };

    const jobResponse = await axios.post(`${BASE_URL}/jobs`, jobData, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    console.log('✅ Job created:', jobResponse.data.message);
    const jobId = jobResponse.data.jobId;

    // Test 3: Register a job seeker
    console.log('\n3. 👨‍💻 Registering a job seeker...');
    const jobseekerData = {
      email: 'myjobseeker@email.com',
      password: 'mypassword123',
      userType: 'jobseeker',
      fullName: 'My Job Seeker Name'
    };

    let jobseekerToken;
    try {
      const jobseekerResponse = await axios.post(`${BASE_URL}/auth/register`, jobseekerData);
      console.log('✅ Job seeker registered:', jobseekerResponse.data.message);
      jobseekerToken = jobseekerResponse.data.token;
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('ℹ️ Job seeker already exists, logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: jobseekerData.email,
          password: jobseekerData.password
        });
        jobseekerToken = loginResponse.data.token;
        console.log('✅ Job seeker logged in successfully');
      } else {
        throw error;
      }
    }

    // Test 4: Apply for the job (this will fail because we need file upload)
    console.log('\n4. 📄 Testing job application (without file)...');
    try {
      const applicationData = {
        jobId: jobId,
        coverLetter: 'This is my custom cover letter for the job application.'
      };

      const applicationResponse = await axios.post(`${BASE_URL}/applications`, applicationData, {
        headers: { Authorization: `Bearer ${jobseekerToken}` }
      });
      console.log('✅ Application submitted:', applicationResponse.data.message);
    } catch (error) {
      console.log('⚠️ Application failed (expected - needs resume file):', error.response?.data?.error);
    }

    // Test 5: Get all jobs to verify our job appears
    console.log('\n5. 🔍 Fetching all jobs...');
    const allJobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log(`✅ Found ${allJobsResponse.data.length} jobs total`);
    
    const myJob = allJobsResponse.data.find(job => job.title === 'My Custom Job Title');
    if (myJob) {
      console.log('✅ My custom job found in the list!');
      console.log(`   Title: ${myJob.title}`);
      console.log(`   Company: ${myJob.company}`);
      console.log(`   ID: ${myJob._id}`);
    } else {
      console.log('❌ My custom job NOT found in the list');
    }

    // Test 6: Get recruiter's jobs
    console.log('\n6. 📋 Getting recruiter\'s jobs...');
    const recruiterJobsResponse = await axios.get(`${BASE_URL}/jobs/recruiter/my-jobs`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    console.log(`✅ Recruiter has ${recruiterJobsResponse.data.length} jobs`);

    console.log('\n🎉 Real user flow test completed!');
    console.log('\n📊 Now check MongoDB Atlas dashboard for your custom data:');
    console.log('- Look for user: myrecruiter@company.com');
    console.log('- Look for user: myjobseeker@email.com');
    console.log('- Look for job: My Custom Job Title');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRealUserFlow();
