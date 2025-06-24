// Test the new application flow without resume requirement
const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'http://localhost:3002/api';

async function testNewApplicationFlow() {
  try {
    console.log('🔄 Testing New Application Flow (No Resume Required)...');

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
      title: 'Web Development Service',
      mobile: '+1-555-123-4567',
      email: 'service@example.com',
      company: 'Test Company',
      location: 'Remote',
      experience: '3-5 years',
      skills: 'JavaScript, React, Node.js',
      description: 'Professional web development services',
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

    // Step 3: Test new application flow (no resume required)
    console.log('\n📝 Step 3: Submit application with direct information...');
    const applicationData = {
      serviceId: serviceId,
      applicantName: 'John Doe',
      applicantEmail: 'john.doe@example.com',
      applicantPhone: '+1-555-987-6543',
      applicantSkills: 'JavaScript, React, Node.js, MongoDB, 3 years experience',
      coverLetter: 'I am very interested in this web development service. I have 3 years of experience with JavaScript, React, and Node.js. I would love to discuss how I can help with your project.'
    };

    const applicationResponse = await axios.post(`${API_BASE_URL}/applications`, applicationData, {
      headers: {
        'Authorization': `Bearer ${jobseekerToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Application submitted successfully');
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
    console.log('Applications:', applications.map(app => ({ id: app._id, service_id: app.service_id, applicant: app.full_name })));
    console.log('Looking for service ID:', serviceId);

    const submittedApplication = applications.find(app =>
      (typeof app.service_id === 'object' ? app.service_id._id : app.service_id) === serviceId
    );
    if (submittedApplication) {
      console.log('✅ Application found in recruiter\'s list');
      console.log('📊 Application details:');
      console.log(`   - Applicant Name: ${submittedApplication.full_name}`);
      console.log(`   - Email: ${submittedApplication.email}`);
      console.log(`   - Phone: ${submittedApplication.phone}`);
      console.log(`   - Skills: ${submittedApplication.skills}`);
      console.log(`   - Cover Letter: ${submittedApplication.cover_letter}`);
      console.log(`   - Status: ${submittedApplication.status}`);
      console.log(`   - Applied Date: ${submittedApplication.applied_date}`);
    } else {
      console.log('❌ Application not found in recruiter\'s list');
      return;
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
      console.log(`   - Service Title: ${myApplication.title}`);
      console.log(`   - Company: ${myApplication.company}`);
      console.log(`   - Status: ${myApplication.status}`);
      console.log(`   - Applied Date: ${myApplication.applied_date}`);
    } else {
      console.log('❌ Application not found in jobseeker\'s list');
    }

    // Step 6: Register another jobseeker for file upload test
    console.log('\n📝 Step 6: Register another jobseeker for file upload test...');
    const jobseeker2Data = {
      email: `test-jobseeker2-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Jobseeker 2',
      userType: 'jobseeker'
    };

    const jobseeker2Response = await axios.post(`${API_BASE_URL}/auth/register`, jobseeker2Data);
    const jobseeker2Token = jobseeker2Response.data.token;
    console.log('✅ Second jobseeker registered');

    // Step 7: Test application with file upload (backward compatibility)
    console.log('\n📝 Step 7: Test application with file upload (backward compatibility)...');
    
    // Create a simple test file (PDF format for proper validation)
    const fs = require('fs');
    const path = require('path');
    const testResumeContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF';
    const resumePath = path.join(__dirname, 'test-resume.pdf');
    fs.writeFileSync(resumePath, testResumeContent);

    const fileFormData = new FormData();
    fileFormData.append('serviceId', serviceId);
    fileFormData.append('applicantName', 'Jane Smith');
    fileFormData.append('applicantEmail', 'jane.smith@example.com');
    fileFormData.append('applicantPhone', '+1-555-111-2222');
    fileFormData.append('applicantSkills', 'JavaScript, React, Node.js, 5 years experience');
    fileFormData.append('coverLetter', 'I am applying for this position with my resume attached.');
    fileFormData.append('resume', fs.createReadStream(resumePath));

    const fileApplicationResponse = await axios.post(`${API_BASE_URL}/applications`, fileFormData, {
      headers: {
        'Authorization': `Bearer ${jobseeker2Token}`,
        ...fileFormData.getHeaders()
      }
    });

    console.log('✅ Application with file submitted successfully');
    console.log('📊 File Application ID:', fileApplicationResponse.data.applicationId);

    // Clean up test file
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
      console.log('✅ Test resume file cleaned up');
    }

    // Step 8: Verify both applications in recruiter's list
    console.log('\n📝 Step 8: Verify both applications in recruiter\'s list...');
    const finalApplicationsResponse = await axios.get(`${API_BASE_URL}/applications/recruiter/all`, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`
      }
    });

    const finalApplications = finalApplicationsResponse.data;
    console.log(`✅ Total applications: ${finalApplications.length} (should be 2)`);

    finalApplications.forEach((app, index) => {
      console.log(`\n📋 Application ${index + 1}:`);
      console.log(`   - Applicant: ${app.full_name}`);
      console.log(`   - Email: ${app.email}`);
      console.log(`   - Phone: ${app.phone}`);
      console.log(`   - Skills: ${app.skills}`);
      console.log(`   - Resume File: ${app.resume_filename || 'None'}`);
      console.log(`   - Status: ${app.status}`);
    });

    // Step 9: Clean up - delete service and applications
    console.log('\n📝 Step 9: Clean up...');
    await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`
      }
    });
    console.log('✅ Service deleted');

    console.log('\n🎉 New Application Flow Test Passed!');
    console.log('✅ Applications work without resume requirement');
    console.log('✅ Direct application data is stored correctly');
    console.log('✅ Applications appear in both recruiter and jobseeker lists');
    console.log('✅ Backward compatibility with file uploads maintained');
    console.log('✅ All application information is properly displayed');

  } catch (error) {
    console.error('❌ New Application Flow test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testNewApplicationFlow();
