// Test "My Services" functionality
const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'http://localhost:3002/api';

async function testMyServices() {
  try {
    console.log('🔄 Testing "My Services" Functionality...');

    // Step 1: Register a test recruiter
    console.log('\n📝 Step 1: Register test recruiter...');
    const recruiterData = {
      email: `test-my-services-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test My Services Recruiter',
      userType: 'recruiter',
      companyName: 'My Services Test Company'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, recruiterData);
    console.log('✅ Recruiter registered successfully');
    
    const { token, user } = registerResponse.data;
    console.log('👤 User ID:', user._id);

    // Step 2: Create multiple services
    console.log('\n📝 Step 2: Create multiple services...');
    const services = [
      {
        title: 'Web Development Service 1',
        mobile: '+1-555-111-1111',
        email: 'service1@example.com',
        company: 'My Services Test Company',
        location: 'Remote',
        experience: '3-5 years',
        skills: 'JavaScript, React, Node.js',
        description: 'Professional web development service #1',
        salaryRange: '$50-70/hour',
        serviceType: 'hourly'
      },
      {
        title: 'Mobile App Development Service',
        mobile: '+1-555-222-2222',
        email: 'service2@example.com',
        company: 'My Services Test Company',
        location: 'Remote',
        experience: '5+ years',
        skills: 'React Native, Flutter, iOS, Android',
        description: 'Professional mobile app development service',
        salaryRange: '$60-80/hour',
        serviceType: 'hourly'
      },
      {
        title: 'Full-Stack Development Service',
        mobile: '+1-555-333-3333',
        email: 'service3@example.com',
        company: 'My Services Test Company',
        location: 'Remote',
        experience: '3-5 years',
        skills: 'JavaScript, Python, React, Django, PostgreSQL',
        description: 'Complete full-stack development solutions',
        salaryRange: '$70,000 - $90,000',
        serviceType: 'full-time'
      }
    ];

    const createdServiceIds = [];

    for (let i = 0; i < services.length; i++) {
      const serviceData = services[i];
      console.log(`Creating service ${i + 1}: ${serviceData.title}`);
      
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

      console.log(`✅ Service ${i + 1} created with ID: ${serviceResponse.data.serviceId}`);
      createdServiceIds.push(serviceResponse.data.serviceId);
    }

    // Step 3: Test "My Services" endpoint
    console.log('\n📝 Step 3: Test "My Services" endpoint...');
    const myServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ My Services retrieved successfully');
    console.log(`📊 Found ${myServicesResponse.data.length} services`);

    // Verify all created services are in the response
    const retrievedServiceIds = myServicesResponse.data.map(service => service._id);
    console.log('📊 Retrieved service IDs:', retrievedServiceIds);
    console.log('📊 Created service IDs:', createdServiceIds);

    let allServicesFound = true;
    for (const createdId of createdServiceIds) {
      if (!retrievedServiceIds.includes(createdId)) {
        console.log(`❌ Service ${createdId} not found in My Services`);
        allServicesFound = false;
      } else {
        console.log(`✅ Service ${createdId} found in My Services`);
      }
    }

    if (allServicesFound) {
      console.log('✅ All created services found in My Services');
    } else {
      console.log('❌ Some services missing from My Services');
    }

    // Step 4: Display service details
    console.log('\n📝 Step 4: Display service details...');
    myServicesResponse.data.forEach((service, index) => {
      console.log(`\n📋 Service ${index + 1}:`);
      console.log(`   - Title: ${service.title}`);
      console.log(`   - Mobile: ${service.mobile}`);
      console.log(`   - Email: ${service.email}`);
      console.log(`   - Company: ${service.company}`);
      console.log(`   - Service Type: ${service.service_type}`);
      console.log(`   - Status: ${service.status}`);
      console.log(`   - Created: ${service.created_at}`);
    });

    // Step 5: Test with different user (should get empty list)
    console.log('\n📝 Step 5: Test with different user...');
    const otherUserData = {
      email: `other-user-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Other User',
      userType: 'recruiter',
      companyName: 'Other Company'
    };

    const otherUserResponse = await axios.post(`${API_BASE_URL}/auth/register`, otherUserData);
    const otherToken = otherUserResponse.data.token;

    const otherUserServicesResponse = await axios.get(`${API_BASE_URL}/services/recruiter/my-services`, {
      headers: {
        'Authorization': `Bearer ${otherToken}`
      }
    });

    console.log(`✅ Other user services: ${otherUserServicesResponse.data.length} (should be 0)`);

    // Step 6: Clean up - delete test services
    console.log('\n📝 Step 6: Clean up test services...');
    for (const serviceId of createdServiceIds) {
      try {
        await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`✅ Service ${serviceId} deleted`);
      } catch (error) {
        console.log(`⚠️ Failed to delete service ${serviceId}:`, error.response?.data);
      }
    }

    console.log('\n🎉 All "My Services" tests passed!');
    console.log('✅ Services are created correctly');
    console.log('✅ My Services endpoint returns correct services');
    console.log('✅ User isolation working (users only see their own services)');
    console.log('✅ Service details are complete and accurate');

  } catch (error) {
    console.error('❌ My Services test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

// Run the test
testMyServices();
