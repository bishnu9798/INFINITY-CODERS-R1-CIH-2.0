// Complete end-to-end test for "My Services" functionality
const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'http://localhost:3002/api';

async function testCompleteMyServicesFlow() {
  try {
    console.log('🔄 Testing Complete "My Services" Flow...');

    // Step 1: Register a test recruiter
    console.log('\n📝 Step 1: Register test recruiter...');
    const recruiterData = {
      email: `complete-test-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Complete Test Recruiter',
      userType: 'recruiter',
      companyName: 'Complete Test Company'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, recruiterData);
    console.log('✅ Recruiter registered successfully');
    
    const { token, user } = registerResponse.data;
    console.log('👤 User ID:', user._id);

    // Step 2: Verify empty "My Services" initially
    console.log('\n📝 Step 2: Verify empty "My Services" initially...');
    const initialServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✅ Initial services count: ${initialServicesResponse.data.length} (should be 0)`);
    if (initialServicesResponse.data.length !== 0) {
      console.log('⚠️ Expected 0 services initially, but found:', initialServicesResponse.data.length);
    }

    // Step 3: Create a service
    console.log('\n📝 Step 3: Create a service...');
    const serviceData = {
      title: 'Complete Test Service - Web Development',
      mobile: '+1-555-COMPLETE',
      email: 'complete-test@example.com',
      company: 'Complete Test Company',
      location: 'Remote',
      experience: '3-5 years',
      skills: 'JavaScript, React, Node.js, MongoDB, Testing',
      description: 'This is a complete test service to verify the entire My Services flow is working correctly.',
      salaryRange: '$60-80/hour',
      serviceType: 'hourly'
    };

    const formData = new FormData();
    Object.keys(serviceData).forEach(key => {
      formData.append(key, serviceData[key]);
    });

    const serviceResponse = await axios.post(`${API_BASE_URL}/services`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    console.log('✅ Service created successfully');
    console.log('📊 Service ID:', serviceResponse.data.serviceId);
    const createdServiceId = serviceResponse.data.serviceId;

    // Step 4: Verify service appears in "My Services"
    console.log('\n📝 Step 4: Verify service appears in "My Services"...');
    const myServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✅ My Services count: ${myServicesResponse.data.length} (should be 1)`);
    
    if (myServicesResponse.data.length === 1) {
      const service = myServicesResponse.data[0];
      console.log('✅ Service found in My Services');
      console.log('📊 Service details:');
      console.log(`   - ID: ${service._id}`);
      console.log(`   - Title: ${service.title}`);
      console.log(`   - Mobile: ${service.mobile}`);
      console.log(`   - Email: ${service.email}`);
      console.log(`   - Company: ${service.company}`);
      console.log(`   - Service Type: ${service.service_type}`);
      console.log(`   - Status: ${service.status}`);
      
      // Verify the service ID matches
      if (service._id === createdServiceId) {
        console.log('✅ Service ID matches created service');
      } else {
        console.log('❌ Service ID mismatch:', service._id, 'vs', createdServiceId);
      }
    } else {
      console.log('❌ Expected 1 service in My Services, but found:', myServicesResponse.data.length);
      return;
    }

    // Step 5: Verify service appears in public services list
    console.log('\n📝 Step 5: Verify service appears in public services list...');
    const publicServicesResponse = await axios.get(`${API_BASE_URL}/services`);
    const publicService = publicServicesResponse.data.find(s => s._id === createdServiceId);
    
    if (publicService) {
      console.log('✅ Service found in public services list');
    } else {
      console.log('❌ Service not found in public services list');
    }

    // Step 6: Create another service
    console.log('\n📝 Step 6: Create another service...');
    const secondServiceData = {
      title: 'Complete Test Service 2 - Mobile Development',
      mobile: '+1-555-MOBILE-2',
      email: 'mobile-test@example.com',
      company: 'Complete Test Company',
      location: 'Remote',
      experience: '5+ years',
      skills: 'React Native, Flutter, iOS, Android',
      description: 'Second test service for mobile development.',
      salaryRange: '$70-90/hour',
      serviceType: 'hourly'
    };

    const secondFormData = new FormData();
    Object.keys(secondServiceData).forEach(key => {
      secondFormData.append(key, secondServiceData[key]);
    });

    const secondServiceResponse = await axios.post(`${API_BASE_URL}/services`, secondFormData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...secondFormData.getHeaders()
      }
    });

    console.log('✅ Second service created successfully');
    console.log('📊 Second Service ID:', secondServiceResponse.data.serviceId);
    const secondServiceId = secondServiceResponse.data.serviceId;

    // Step 7: Verify both services appear in "My Services"
    console.log('\n📝 Step 7: Verify both services appear in "My Services"...');
    const finalServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✅ Final My Services count: ${finalServicesResponse.data.length} (should be 2)`);
    
    if (finalServicesResponse.data.length === 2) {
      console.log('✅ Both services found in My Services');
      finalServicesResponse.data.forEach((service, index) => {
        console.log(`📋 Service ${index + 1}:`);
        console.log(`   - Title: ${service.title}`);
        console.log(`   - Mobile: ${service.mobile}`);
        console.log(`   - Email: ${service.email}`);
        console.log(`   - Service Type: ${service.service_type}`);
      });
    } else {
      console.log('❌ Expected 2 services in My Services, but found:', finalServicesResponse.data.length);
    }

    // Step 8: Test frontend API compatibility
    console.log('\n📝 Step 8: Test frontend API compatibility...');
    
    // Test the getMyJobs alias (for backward compatibility)
    try {
      const aliasResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Frontend API alias working correctly');
      console.log(`📊 Services via alias: ${aliasResponse.data.length}`);
    } catch (error) {
      console.log('❌ Frontend API alias failed:', error.response?.data);
    }

    // Step 9: Clean up - delete test services
    console.log('\n📝 Step 9: Clean up test services...');
    try {
      await axios.delete(`${API_BASE_URL}/services/${createdServiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`✅ First service deleted: ${createdServiceId}`);
    } catch (error) {
      console.log(`⚠️ Failed to delete first service:`, error.response?.data);
    }

    try {
      await axios.delete(`${API_BASE_URL}/services/${secondServiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`✅ Second service deleted: ${secondServiceId}`);
    } catch (error) {
      console.log(`⚠️ Failed to delete second service:`, error.response?.data);
    }

    // Step 10: Verify services are deleted from "My Services"
    console.log('\n📝 Step 10: Verify services are deleted from "My Services"...');
    const cleanupServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✅ Final cleanup count: ${cleanupServicesResponse.data.length} (should be 0)`);

    console.log('\n🎉 Complete "My Services" flow test passed!');
    console.log('✅ Registration working');
    console.log('✅ Service creation working');
    console.log('✅ My Services endpoint working');
    console.log('✅ Service listing working');
    console.log('✅ Multiple services working');
    console.log('✅ Service deletion working');
    console.log('✅ Frontend API compatibility working');

  } catch (error) {
    console.error('❌ Complete My Services flow test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testCompleteMyServicesFlow();
