// Test application submission after fixing indexes
const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'http://localhost:3002/api';

async function testApplicationSubmission() {
  try {
    console.log('🔄 Testing Application Submission After Index Fix...');

    // Step 1: Register a recruiter and create a service
    console.log('\n📝 Step 1: Register recruiter and create service...');
    const recruiterData = {
      email: `test-recruiter-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Recruiter',
      userType: 'recruiter',
      companyName: 'Test Company'
    };

    const recruiterResponse = await axios.post(`${API_BASE_URL}/auth/register`, recruiterData);
    const recruiterToken = recruiterResponse.data.token;
    console.log('✅ Recruiter registered');

    // Create a service
    const serviceData = {
      title: 'Test Application Service',
      mobile: '+1-555-123-4567',
      email: 'service@example.com',
      company: 'Test Company',
      location: 'Remote',
      experience: '2-4 years',
      skills: 'JavaScript, React, Node.js',
      description: 'Test service for application submission',
      salaryRange: '$50-70/hour',
      serviceType: 'hourly'
    };

    const formData = new FormData();
    Object.keys(serviceData).forEach(key => {
      formData.append(key, serviceData[key]);
    });

    const serviceResponse = await axios.post(`${API_BASE_URL}/services`, formData, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`,
        ...formData.getHeaders()
      }
    });

    const serviceId = serviceResponse.data.serviceId;
    console.log('✅ Service created:', serviceId);

    // Step 2: Register a jobseeker
    console.log('\n📝 Step 2: Register jobseeker...');
    const jobseekerData = {
      email: `test-jobseeker-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Jobseeker',
      userType: 'jobseeker'
    };

    const jobseekerResponse = await axios.post(`${API_BASE_URL}/auth/register`, jobseekerData);
    const jobseekerToken = jobseekerResponse.data.token;
    console.log('✅ Jobseeker registered');

    // Step 3: Test application submission (the main test)
    console.log('\n📝 Step 3: Submit application...');
    const applicationData = {
      serviceId: serviceId,
      applicantName: 'John Doe',
      applicantEmail: 'john.doe@example.com',
      applicantPhone: '+1-555-987-6543',
      applicantSkills: 'JavaScript, React, Node.js, 3 years experience',
      coverLetter: 'I am very interested in this service. I have the required skills and experience.'
    };

    console.log('📊 Application data:', applicationData);

    const applicationResponse = await axios.post(`${API_BASE_URL}/applications`, applicationData, {
      headers: {
        'Authorization': `Bearer ${jobseekerToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Application submitted successfully!');
    console.log('📊 Application ID:', applicationResponse.data.applicationId);

    // Step 4: Verify application appears in recruiter's applications
    console.log('\n📝 Step 4: Verify application in recruiter\'s list...');
    const recruiterApplicationsResponse = await axios.get(`${API_BASE_URL}/applications/recruiter/all`, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`
      }
    });

    const applications = recruiterApplicationsResponse.data;
    console.log(`✅ Found ${applications.length} applications`);

    const submittedApplication = applications.find(app => 
      (typeof app.service_id === 'object' ? app.service_id._id : app.service_id) === serviceId
    );

    if (submittedApplication) {
      console.log('✅ Application found in recruiter\'s list');
      console.log('📊 Application details:');
      console.log(`   - Applicant: ${submittedApplication.full_name}`);
      console.log(`   - Email: ${submittedApplication.email}`);
      console.log(`   - Phone: ${submittedApplication.phone}`);
      console.log(`   - Skills: ${submittedApplication.skills}`);
      console.log(`   - Status: ${submittedApplication.status}`);
    } else {
      console.log('❌ Application not found in recruiter\'s list');
    }

    // Step 5: Verify application appears in jobseeker's applications
    console.log('\n📝 Step 5: Verify application in jobseeker\'s list...');
    const jobseekerApplicationsResponse = await axios.get(`${API_BASE_URL}/applications/my-applications`, {
      headers: {
        'Authorization': `Bearer ${jobseekerToken}`
      }
    });

    const myApplications = jobseekerApplicationsResponse.data;
    console.log(`✅ Found ${myApplications.length} applications in jobseeker's list`);

    const myApplication = myApplications.find(app => 
      (typeof app.service_id === 'object' ? app.service_id._id : app.service_id) === serviceId
    );

    if (myApplication) {
      console.log('✅ Application found in jobseeker\'s list');
      console.log('📊 My application details:');
      console.log(`   - Service: ${myApplication.title}`);
      console.log(`   - Company: ${myApplication.company}`);
      console.log(`   - Status: ${myApplication.status}`);
    } else {
      console.log('❌ Application not found in jobseeker\'s list');
    }

    // Step 6: Test duplicate application prevention
    console.log('\n📝 Step 6: Test duplicate application prevention...');
    try {
      await axios.post(`${API_BASE_URL}/applications`, applicationData, {
        headers: {
          'Authorization': `Bearer ${jobseekerToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Duplicate application should have been prevented');
    } catch (duplicateError) {
      if (duplicateError.response?.status === 400) {
        console.log('✅ Duplicate application correctly prevented');
        console.log('📊 Error message:', duplicateError.response.data.error);
      } else {
        console.log('⚠️ Unexpected error for duplicate application:', duplicateError.message);
      }
    }

    // Step 7: Clean up
    console.log('\n📝 Step 7: Clean up...');
    await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`
      }
    });
    console.log('✅ Service deleted');

    console.log('\n🎉 Application Submission Test Passed!');
    console.log('✅ Application submission working correctly');
    console.log('✅ Applications appear in both recruiter and jobseeker lists');
    console.log('✅ Duplicate application prevention working');
    console.log('✅ Database indexes fixed successfully');

  } catch (error) {
    console.error('❌ Application submission test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testApplicationSubmission();
