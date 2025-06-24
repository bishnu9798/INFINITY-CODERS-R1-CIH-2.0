const mongoose = require('mongoose');
const User = require('./models/User.js');
const Services = require('./models/Services.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function addSampleData() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'jobportal'
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // Clear existing test data (optional)
    console.log('🧹 Clearing existing test data...');
    await User.deleteMany({ email: { $regex: /test/i } });
    await Job.deleteMany({ title: { $regex: /test/i } });
    await Application.deleteMany({});

    // Create Recruiters
    console.log('👔 Creating Recruiter Accounts...');
    
    const recruiter1 = new User({
      email: 'hr@techcorp.com',
      password: 'password123',
      user_type: 'recruiter',
      full_name: 'Sarah Johnson',
      company_name: 'TechCorp Solutions',
      phone: '+1-555-0101',
      location: 'San Francisco, CA'
    });
    await recruiter1.save();

    const recruiter2 = new User({
      email: 'hiring@innovatetech.com',
      password: 'password123',
      user_type: 'recruiter',
      full_name: 'Michael Chen',
      company_name: 'InnovateTech Inc',
      phone: '+1-555-0102',
      location: 'New York, NY'
    });
    await recruiter2.save();

    // Create Job Seekers
    console.log('👨‍💻 Creating Job Seeker Accounts...');
    
    const jobseeker1 = new User({
      email: 'john.developer@email.com',
      password: 'password123',
      user_type: 'jobseeker',
      full_name: 'John Smith',
      phone: '+1-555-0201',
      location: 'Austin, TX',
      skills: 'JavaScript, React, Node.js, MongoDB',
      experience: '3 years',
      education: 'Bachelor of Computer Science'
    });
    await jobseeker1.save();

    const jobseeker2 = new User({
      email: 'jane.designer@email.com',
      password: 'password123',
      user_type: 'jobseeker',
      full_name: 'Jane Wilson',
      phone: '+1-555-0202',
      location: 'Los Angeles, CA',
      skills: 'UI/UX Design, Figma, Adobe Creative Suite',
      experience: '2 years',
      education: 'Bachelor of Design'
    });
    await jobseeker2.save();

    // Create Jobs
    console.log('💼 Creating Job Postings...');
    
    const job1 = new Job({
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      experience: '3-5 years',
      skills: 'JavaScript,React,Node.js,MongoDB,AWS',
      description: 'We are looking for a passionate Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
      salary_range: '$90,000 - $120,000',
      job_type: 'full-time',
      recruiter_id: recruiter1._id,
      status: 'active'
    });
    await job1.save();

    const job2 = new Job({
      title: 'Frontend React Developer',
      company: 'InnovateTech Inc',
      location: 'New York, NY',
      experience: '2-4 years',
      skills: 'React,TypeScript,CSS,HTML,Git',
      description: 'Join our frontend team to build amazing user interfaces. We work with the latest React technologies and modern development practices.',
      salary_range: '$70,000 - $95,000',
      job_type: 'full-time',
      recruiter_id: recruiter2._id,
      status: 'active'
    });
    await job2.save();

    const job3 = new Job({
      title: 'UI/UX Designer',
      company: 'TechCorp Solutions',
      location: 'Remote',
      experience: '1-3 years',
      skills: 'Figma,Adobe XD,Sketch,Prototyping,User Research',
      description: 'We need a creative UI/UX Designer to help us create intuitive and beautiful user experiences for our products.',
      salary_range: '$60,000 - $80,000',
      job_type: 'remote',
      recruiter_id: recruiter1._id,
      status: 'active'
    });
    await job3.save();

    // Create Applications
    console.log('📄 Creating Job Applications...');
    
    const application1 = new Application({
      job_id: job1._id,
      jobseeker_id: jobseeker1._id,
      resume_filename: 'john_smith_resume.pdf',
      cover_letter: 'I am very interested in this position and believe my skills in full stack development make me a great fit.',
      status: 'applied'
    });
    await application1.save();

    const application2 = new Application({
      job_id: job2._id,
      jobseeker_id: jobseeker1._id,
      resume_filename: 'john_smith_resume.pdf',
      cover_letter: 'I would love to contribute to your frontend team with my React expertise.',
      status: 'shortlisted'
    });
    await application2.save();

    const application3 = new Application({
      job_id: job3._id,
      jobseeker_id: jobseeker2._id,
      resume_filename: 'jane_wilson_portfolio.pdf',
      cover_letter: 'As a UI/UX designer, I am excited about the opportunity to create amazing user experiences.',
      status: 'applied'
    });
    await application3.save();

    console.log('\n✅ Sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log('- 2 Recruiters created');
    console.log('- 2 Job Seekers created');
    console.log('- 3 Jobs posted');
    console.log('- 3 Applications submitted');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

addSampleData();
