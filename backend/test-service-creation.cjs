// Test service creation to debug the issue
const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'http://localhost:3002/api';

async function testServiceCreation() {
  try {
    console.log('🔄 Testing Service Creation...');

    // Step 1: Register a recruiter
    console.log('\n📝 Step 1: Register recruiter...');
    const recruiterData = {
      email: `test-service-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Service Recruiter',
      userType: 'recruiter',
      companyName: 'Test Service Company'
    };

    const recruiterResponse = await axios.post(`${API_BASE_URL}/auth/register`, recruiterData);
    const recruiterToken = recruiterResponse.data.token;
    console.log('✅ Recruiter registered');

    // Step 2: Test service creation with exact frontend data
    console.log('\n📝 Step 2: Create service with FormData...');
    
    const formData = new FormData();
    formData.append('title', 'Test Web Development Service');
    formData.append('mobile', '+1-555-123-4567');
    formData.append('email', 'test@example.com');
    formData.append('company', 'Test Company');
    formData.append('location', 'Remote');
    formData.append('experience', '2-4 years');
    formData.append('skills', 'JavaScript, React, Node.js');
    formData.append('description', 'Professional web development services for modern applications');
    formData.append('salaryRange', '$50-70/hour');
    formData.append('serviceType', 'hourly');

    console.log('📊 FormData created with fields: title, mobile, email, company, location, experience, skills, description, salaryRange, serviceType');

    const serviceResponse = await axios.post(`${API_BASE_URL}/services`, formData, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`,
        ...formData.getHeaders()
      }
    });

    console.log('✅ Service created successfully!');
    console.log('📊 Service ID:', serviceResponse.data.serviceId);

    // Step 3: Verify service was created
    console.log('\n📝 Step 3: Verify service in database...');
    const servicesResponse = await axios.get(`${API_BASE_URL}/services`);
    const services = servicesResponse.data;
    
    const createdService = services.find(s => s._id === serviceResponse.data.serviceId);
    if (createdService) {
      console.log('✅ Service found in database');
      console.log('📊 Service details:');
      console.log(`   - Title: ${createdService.title}`);
      console.log(`   - Company: ${createdService.company}`);
      console.log(`   - Location: ${createdService.location}`);
      console.log(`   - Experience: ${createdService.experience}`);
      console.log(`   - Skills: ${createdService.skills}`);
      console.log(`   - Mobile: ${createdService.mobile}`);
      console.log(`   - Email: ${createdService.email}`);
      console.log(`   - Service Type: ${createdService.service_type}`);
      console.log(`   - Salary Range: ${createdService.salary_range}`);
    } else {
      console.log('❌ Service not found in database');
    }

    // Step 4: Test with missing required field
    console.log('\n📝 Step 4: Test validation with missing field...');
    
    const invalidFormData = new FormData();
    invalidFormData.append('title', 'Test Service');
    // Missing required fields intentionally
    
    try {
      await axios.post(`${API_BASE_URL}/services`, invalidFormData, {
        headers: {
          'Authorization': `Bearer ${recruiterToken}`,
          ...invalidFormData.getHeaders()
        }
      });
      console.log('❌ Validation should have failed');
    } catch (validationError) {
      console.log('✅ Validation working correctly');
      console.log('📊 Validation error:', validationError.response?.data);
    }

    // Step 5: Clean up
    console.log('\n📝 Step 5: Clean up...');
    await axios.delete(`${API_BASE_URL}/services/${serviceResponse.data.serviceId}`, {
      headers: {
        'Authorization': `Bearer ${recruiterToken}`
      }
    });
    console.log('✅ Service deleted');

    console.log('\n🎉 Service Creation Test Passed!');

  } catch (error) {
    console.error('❌ Service creation test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
      console.error('❌ Response headers:', error.response.headers);
    }
    if (error.request) {
      console.error('❌ Request details:', {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers
      });
    }
  }
}

// Run the test
testServiceCreation();
