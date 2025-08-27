const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testYourApplication() {
  try {
    console.log('🎯 Testing YOUR job application...\n');
    
    // Login as your jobseeker
    console.log('1. Logging in as your jobseeker...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'manish1@gmail.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');
    
    // Get all jobs to find your job
    console.log('\n2. Getting all jobs...');
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`);
    const jobs = jobsResponse.data;
    
    console.log(`Found ${jobs.length} jobs:`);
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company}`);
      console.log(`   ID: ${job._id}`);
      console.log(`   Skills: ${job.skills}`);
    });
    
    // Find your job
    const yourJob = jobs.find(job => job.title === 'Full stack web developer');
    if (!yourJob) {
      console.log('❌ Your job not found!');
      return;
    }
    
    console.log(`\n3. Found your job: ${yourJob.title}`);
    console.log(`   Job ID: ${yourJob._id}`);
    
    // Try to apply (this will fail because we need a file, but we'll see the validation)
    console.log('\n4. Testing application (without file)...');
    try {
      const applicationResponse = await axios.post(`${BASE_URL}/applications`, {
        jobId: yourJob._id,
        coverLetter: 'This is a test application for your job!'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Application successful:', applicationResponse.data);
    } catch (error) {
      console.log('⚠️ Application failed (expected):', error.response?.data?.error);
      
      // If it's just the resume requirement, that's good - the jobId is working
      if (error.response?.data?.error === 'Resume file is required') {
        console.log('✅ Job ID is working! The only issue is missing resume file.');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testYourApplication();
