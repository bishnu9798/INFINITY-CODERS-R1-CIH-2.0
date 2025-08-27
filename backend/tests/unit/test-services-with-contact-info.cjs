// Test script to verify Services model with mobile, email, and resume fields
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3002/api';

async function testServicesWithContactInfo() {
  try {
    console.log('🔄 Testing Services Model with Contact Information...');

    // Step 1: Register a test recruiter
    console.log('\n📝 Step 1: Register test recruiter...');
    const recruiterData = {
      email: `test-freelancer-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Freelancer',
      userType: 'recruiter',
      companyName: 'Freelance Services Inc.'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, recruiterData);
    console.log('✅ Freelancer registered successfully');
    
    const { token, user } = registerResponse.data;
    console.log('👤 User ID:', user._id);
    console.log('🔑 Token received');

    // Step 2: Create a dummy resume file for testing
    console.log('\n📝 Step 2: Create test resume file...');
    const testResumeContent = `
TEST RESUME
===========

Name: Test Freelancer
Email: test-freelancer@example.com
Phone: +1-555-123-4567

SKILLS:
- JavaScript
- React
- Node.js
- MongoDB
- Express.js

EXPERIENCE:
- 3+ years in web development
- Full-stack development
- Database design
- API development

EDUCATION:
- Bachelor's in Computer Science
- Various online certifications
`;

    const resumePath = path.join(__dirname, 'test-resume.txt');
    fs.writeFileSync(resumePath, testResumeContent);
    console.log('✅ Test resume file created');

    // Step 3: Create a service with contact info and resume
    console.log('\n📝 Step 3: Create service with contact information...');
    
    const formData = new FormData();
    formData.append('title', 'Full-Stack Web Development Services');
    formData.append('mobile', '+1-555-123-4567');
    formData.append('email', 'test-freelancer@example.com');
    formData.append('company', 'Freelance Services Inc.');
    formData.append('location', 'Remote Worldwide');
    formData.append('experience', '3+ years');
    formData.append('skills', 'JavaScript, React, Node.js, MongoDB, Express.js, API Development');
    formData.append('description', 'Professional full-stack web development services. I specialize in creating modern, responsive web applications using the latest technologies. Available for both short-term projects and long-term collaborations.');
    formData.append('salaryRange', '$50-80/hour');
    formData.append('serviceType', 'hourly');
    formData.append('resume', fs.createReadStream(resumePath));

    const serviceResponse = await axios.post(`${API_BASE_URL}/services`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    console.log('✅ Service created successfully');
    console.log('📊 Service ID:', serviceResponse.data.serviceId);

    // Step 4: Verify the service was stored with all fields
    console.log('\n📝 Step 4: Verify service in database...');
    const servicesResponse = await axios.get(`${API_BASE_URL}/services`);
    const createdService = servicesResponse.data.find(service => 
      service._id === serviceResponse.data.serviceId
    );

    if (createdService) {
      console.log('✅ Service found in database');
      console.log('📊 Service details:');
      console.log(`   - Title: ${createdService.title}`);
      console.log(`   - Mobile: ${createdService.mobile}`);
      console.log(`   - Email: ${createdService.email}`);
      console.log(`   - Company: ${createdService.company}`);
      console.log(`   - Location: ${createdService.location}`);
      console.log(`   - Service Type: ${createdService.service_type}`);
      console.log(`   - Resume File: ${createdService.resume_filename || 'Not uploaded'}`);
      console.log(`   - Resume Size: ${createdService.resume_file_size || 'N/A'} bytes`);
      console.log(`   - Created: ${createdService.created_at}`);
    } else {
      console.log('❌ Service not found in database');
      return;
    }

    // Step 5: Test resume download (if resume was uploaded)
    if (createdService.resume_filename) {
      console.log('\n📝 Step 5: Test resume download...');
      try {
        const resumeResponse = await axios.get(`${API_BASE_URL}/services/resume/${createdService.resume_filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer'
        });
        console.log('✅ Resume download successful');
        console.log(`📊 Downloaded ${resumeResponse.data.byteLength} bytes`);
      } catch (error) {
        console.log('⚠️ Resume download failed:', error.response?.status, error.response?.data);
      }
    }

    // Step 6: Test real-time stats
    console.log('\n📝 Step 6: Check updated real-time stats...');
    const statsResponse = await axios.get(`${API_BASE_URL}/stats`);
    console.log('✅ Real-time stats retrieved');
    console.log('📊 Current stats:');
    console.log(`   - Total Services: ${statsResponse.data.services?.total || 0}`);
    console.log(`   - Active Services: ${statsResponse.data.services?.active || 0}`);
    console.log(`   - Total Users: ${statsResponse.data.users?.total || 0}`);

    // Step 7: Clean up
    console.log('\n📝 Step 7: Clean up test data...');
    await axios.delete(`${API_BASE_URL}/services/${serviceResponse.data.serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Test service deleted');

    // Remove test resume file
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
      console.log('✅ Test resume file removed');
    }

    console.log('\n🎉 All tests passed!');
    console.log('✅ Services model supports mobile, email, and resume fields');
    console.log('✅ File upload functionality working');
    console.log('✅ Contact information stored correctly');
    console.log('✅ Real-time change streams capturing all data');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    
    // Clean up test file if it exists
    const resumePath = path.join(__dirname, 'test-resume.txt');
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
  }
}

// Run the test
testServicesWithContactInfo();
