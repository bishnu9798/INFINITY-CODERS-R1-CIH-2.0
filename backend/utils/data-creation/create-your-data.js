const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function createYourPersonalData() {
  console.log('🎯 Creating YOUR Personal Data for MongoDB Atlas Dashboard\n');

  try {
    // Create YOUR recruiter account
    console.log('1. 👔 Creating YOUR recruiter account...');
    const yourRecruiterData = {
      email: 'your.email@yourcompany.com',
      password: 'yourpassword123',
      userType: 'recruiter',
      fullName: 'Your Full Name',
      companyName: 'Your Dream Company'
    };

    let yourRecruiterToken;
    try {
      const recruiterResponse = await axios.post(`${BASE_URL}/auth/register`, yourRecruiterData);
      console.log('✅ YOUR recruiter account created!');
      yourRecruiterToken = recruiterResponse.data.token;
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: yourRecruiterData.email,
          password: yourRecruiterData.password
        });
        yourRecruiterToken = loginResponse.data.token;
        console.log('✅ YOUR recruiter account logged in!');
      } else {
        throw error;
      }
    }

    // Create YOUR job postings
    console.log('\n2. 💼 Creating YOUR job postings...');
    const yourJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'Your Dream Company',
        location: 'Your City, Your Country',
        experience: '3-5 years',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        description: 'We are looking for a senior software engineer to join our amazing team. You will work on cutting-edge projects and have the opportunity to grow your career.',
        salaryRange: '$80,000 - $120,000',
        jobType: 'full-time'
      },
      {
        title: 'Frontend Developer',
        company: 'Your Dream Company',
        location: 'Remote',
        experience: '2-4 years',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        description: 'Join our frontend team to build beautiful and responsive user interfaces. We value creativity and innovation.',
        salaryRange: '$70,000 - $100,000',
        jobType: 'remote'
      },
      {
        title: 'DevOps Engineer',
        company: 'Your Dream Company',
        location: 'Hybrid',
        experience: '4-6 years',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
        description: 'Help us build and maintain our cloud infrastructure. You will work with modern DevOps tools and practices.',
        salaryRange: '$90,000 - $130,000',
        jobType: 'full-time'
      }
    ];

    const createdJobIds = [];
    for (const jobData of yourJobs) {
      const jobResponse = await axios.post(`${BASE_URL}/jobs`, jobData, {
        headers: { Authorization: `Bearer ${yourRecruiterToken}` }
      });
      createdJobIds.push(jobResponse.data.jobId);
      console.log(`✅ Created job: ${jobData.title}`);
    }

    // Create YOUR job seeker accounts
    console.log('\n3. 👨‍💻 Creating YOUR job seeker accounts...');
    const yourJobSeekers = [
      {
        email: 'your.jobseeker1@email.com',
        password: 'password123',
        userType: 'jobseeker',
        fullName: 'Alex Developer'
      },
      {
        email: 'your.jobseeker2@email.com',
        password: 'password123',
        userType: 'jobseeker',
        fullName: 'Sarah Designer'
      }
    ];

    const jobSeekerTokens = [];
    for (const seekerData of yourJobSeekers) {
      try {
        const seekerResponse = await axios.post(`${BASE_URL}/auth/register`, seekerData);
        jobSeekerTokens.push(seekerResponse.data.token);
        console.log(`✅ Created job seeker: ${seekerData.fullName}`);
      } catch (error) {
        if (error.response?.data?.error === 'User already exists') {
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: seekerData.email,
            password: seekerData.password
          });
          jobSeekerTokens.push(loginResponse.data.token);
          console.log(`✅ Job seeker logged in: ${seekerData.fullName}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n🎉 YOUR Personal Data Created Successfully!\n');
    
    console.log('📊 What you can now see in MongoDB Atlas Dashboard:');
    console.log('='.repeat(60));
    console.log('👥 USERS:');
    console.log('   - Your Full Name (your.email@yourcompany.com) - Recruiter');
    console.log('   - Alex Developer (your.jobseeker1@email.com) - Job Seeker');
    console.log('   - Sarah Designer (your.jobseeker2@email.com) - Job Seeker');
    console.log('');
    console.log('💼 JOBS:');
    console.log('   - Senior Software Engineer - Your Dream Company');
    console.log('   - Frontend Developer - Your Dream Company');
    console.log('   - DevOps Engineer - Your Dream Company');
    console.log('');
    console.log('🌐 MongoDB Atlas Dashboard:');
    console.log('   1. Go to: https://cloud.mongodb.com/');
    console.log('   2. Login: manishkumarcse07 / manishkaju1234554321');
    console.log('   3. Click: Cluster0 → Browse Collections');
    console.log('   4. Database: jobportal');
    console.log('   5. Collections: users, jobs, applications');
    console.log('');
    console.log('🔐 Test Login Credentials for Frontend:');
    console.log('   Recruiter: your.email@yourcompany.com / yourpassword123');
    console.log('   Job Seeker: your.jobseeker1@email.com / password123');
    console.log('   Job Seeker: your.jobseeker2@email.com / password123');

  } catch (error) {
    console.error('❌ Error creating your data:', error.response?.data || error.message);
  }
}

createYourPersonalData();
