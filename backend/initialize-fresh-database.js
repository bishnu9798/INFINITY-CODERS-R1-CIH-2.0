const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Services = require('./models/Services');
const Application = require('./models/Application');

async function initializeFreshDatabase() {
  try {
    console.log('🔄 Initializing Fresh MongoDB Atlas Database...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);

    // Clear existing data (fresh start)
    console.log('\n🔄 Clearing existing data for fresh start...');
    await User.deleteMany({});
    await Services.deleteMany({});
    await Application.deleteMany({});
    console.log('✅ Database cleared');

    // Create sample users
    console.log('\n🔄 Creating sample users...');
    
    const sampleUsers = [
      {
        email: 'recruiter1@company.com',
        password: 'password123',
        user_type: 'recruiter',
        full_name: 'John Smith',
        phone: '+1-555-0101',
        location: 'New York, NY',
        bio: 'Senior Technical Recruiter with 5+ years experience',
        company_name: 'TechCorp Inc.'
      },
      {
        email: 'recruiter2@startup.com',
        password: 'password123',
        user_type: 'recruiter',
        full_name: 'Sarah Johnson',
        phone: '+1-555-0102',
        location: 'San Francisco, CA',
        bio: 'Startup recruiter specializing in engineering roles',
        company_name: 'InnovateLab'
      },
      {
        email: 'developer1@email.com',
        password: 'password123',
        user_type: 'jobseeker',
        full_name: 'Alex Chen',
        phone: '+1-555-0201',
        location: 'Seattle, WA',
        bio: 'Full-stack developer with expertise in React and Node.js',
        skills: 'JavaScript, React, Node.js, MongoDB, Python',
        experience: '3 years',
        education: 'BS Computer Science - University of Washington'
      },
      {
        email: 'designer1@email.com',
        password: 'password123',
        user_type: 'jobseeker',
        full_name: 'Maria Garcia',
        phone: '+1-555-0202',
        location: 'Austin, TX',
        bio: 'UX/UI Designer passionate about creating user-centered designs',
        skills: 'Figma, Adobe Creative Suite, User Research, Prototyping',
        experience: '4 years',
        education: 'BFA Design - Art Institute of Austin'
      },
      {
        email: 'engineer1@email.com',
        password: 'password123',
        user_type: 'jobseeker',
        full_name: 'David Wilson',
        phone: '+1-555-0203',
        location: 'Boston, MA',
        bio: 'Backend engineer specializing in scalable systems',
        skills: 'Java, Spring Boot, Microservices, AWS, Docker',
        experience: '5 years',
        education: 'MS Computer Science - MIT'
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Get recruiter IDs for job creation
    const recruiters = createdUsers.filter(user => user.user_type === 'recruiter');
    const jobseekers = createdUsers.filter(user => user.user_type === 'jobseeker');

    // Create sample services
    console.log('\n🔄 Creating sample services...');

    const sampleServices = [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'New York, NY (Remote)',
        experience: '3-5 years',
        skills: 'React, Node.js, MongoDB, TypeScript',
        description: 'We are looking for a senior full stack developer to join our growing team. You will work on cutting-edge web applications using modern technologies.',
        salary_range: '$90,000 - $120,000',
        service_type: 'full-time',
        recruiter_id: recruiters[0]._id,
        status: 'active'
      },
      {
        title: 'UX/UI Designer',
        company: 'InnovateLab',
        location: 'San Francisco, CA',
        experience: '2-4 years',
        skills: 'Figma, User Research, Prototyping, Design Systems',
        description: 'Join our design team to create beautiful and intuitive user experiences for our SaaS platform.',
        salary_range: '$75,000 - $95,000',
        service_type: 'full-time',
        recruiter_id: recruiters[1]._id,
        status: 'active'
      },
      {
        title: 'Backend Engineer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        experience: '4-6 years',
        skills: 'Java, Spring Boot, Microservices, AWS',
        description: 'Build and maintain scalable backend services for our enterprise platform.',
        salary_range: '$100,000 - $130,000',
        service_type: 'full-time',
        recruiter_id: recruiters[0]._id,
        status: 'active'
      },
      {
        title: 'Frontend Developer Intern',
        company: 'InnovateLab',
        location: 'San Francisco, CA',
        experience: '0-1 years',
        skills: 'HTML, CSS, JavaScript, React',
        description: 'Great opportunity for students or new graduates to gain experience in frontend development.',
        salary_range: '$20 - $25/hour',
        service_type: 'internship',
        recruiter_id: recruiters[1]._id,
        status: 'active'
      }
    ];

    const createdServices = await Services.insertMany(sampleServices);
    console.log(`✅ Created ${createdServices.length} sample services`);

    // Create sample applications
    console.log('\n🔄 Creating sample applications...');
    
    const sampleApplications = [
      {
        service_id: createdServices[0]._id, // Senior Full Stack Developer
        jobseeker_id: jobseekers[0]._id, // Alex Chen
        cover_letter: 'I am excited to apply for the Senior Full Stack Developer position. My experience with React and Node.js makes me a perfect fit for this role.',
        status: 'applied'
      },
      {
        service_id: createdServices[1]._id, // UX/UI Designer
        jobseeker_id: jobseekers[1]._id, // Maria Garcia
        cover_letter: 'I would love to contribute to your design team. My portfolio showcases my expertise in user-centered design.',
        status: 'shortlisted'
      },
      {
        service_id: createdServices[2]._id, // Backend Engineer
        jobseeker_id: jobseekers[2]._id, // David Wilson
        cover_letter: 'With my extensive experience in Java and microservices, I am confident I can help build scalable backend solutions.',
        status: 'applied'
      }
    ];

    const createdApplications = await Application.insertMany(sampleApplications);
    console.log(`✅ Created ${createdApplications.length} sample applications`);

    // Display summary
    console.log('\n📊 Database Initialization Summary:');
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`   - Recruiters: ${await User.countDocuments({ user_type: 'recruiter' })}`);
    console.log(`   - Job Seekers: ${await User.countDocuments({ user_type: 'jobseeker' })}`);
    console.log(`💼 Services: ${await Services.countDocuments()}`);
    console.log(`   - Active: ${await Services.countDocuments({ status: 'active' })}`);
    console.log(`📄 Applications: ${await Application.countDocuments()}`);
    console.log(`   - Applied: ${await Application.countDocuments({ status: 'applied' })}`);
    console.log(`   - Shortlisted: ${await Application.countDocuments({ status: 'shortlisted' })}`);

    console.log('\n✅ Fresh MongoDB Atlas database initialized successfully!');
    console.log('🎯 Database is ready for real-time data operations.');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run the initialization
initializeFreshDatabase();
