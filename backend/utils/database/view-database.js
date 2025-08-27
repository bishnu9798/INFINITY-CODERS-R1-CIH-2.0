const mongoose = require('mongoose');
const User = require('./models/User.js');
const Job = require('./models/Job.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function viewDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'jobportal'
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // View Users
    console.log('👥 USERS COLLECTION:');
    console.log('='.repeat(50));
    const users = await User.find({}).select('-password');
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name} (${user.user_type})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Company: ${user.company_name || 'N/A'}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
    }

    // View Jobs
    console.log('\n💼 JOBS COLLECTION:');
    console.log('='.repeat(50));
    const jobs = await Job.find({}).populate('recruiter_id', 'full_name company_name');
    if (jobs.length === 0) {
      console.log('No jobs found.');
    } else {
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} at ${job.company}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Experience: ${job.experience}`);
        console.log(`   Skills: ${job.skills}`);
        console.log(`   Status: ${job.status}`);
        console.log(`   Posted by: ${job.recruiter_id?.full_name || 'Unknown'}`);
        console.log(`   Created: ${job.created_at}`);
        console.log('');
      });
    }

    // View Applications
    console.log('\n📄 APPLICATIONS COLLECTION:');
    console.log('='.repeat(50));
    const applications = await Application.find({})
      .populate('job_id', 'title company')
      .populate('jobseeker_id', 'full_name email');
    
    if (applications.length === 0) {
      console.log('No applications found.');
    } else {
      applications.forEach((app, index) => {
        console.log(`${index + 1}. Application for: ${app.job_id?.title || 'Unknown Job'}`);
        console.log(`   Applicant: ${app.jobseeker_id?.full_name || 'Unknown'}`);
        console.log(`   Email: ${app.jobseeker_id?.email || 'Unknown'}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Resume: ${app.resume_filename || 'No resume'}`);
        console.log(`   Applied: ${app.applied_date}`);
        console.log('');
      });
    }

    // Database Statistics
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('='.repeat(50));
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    const activeJobCount = await Job.countDocuments({ status: 'active' });
    
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Jobs: ${jobCount}`);
    console.log(`Active Jobs: ${activeJobCount}`);
    console.log(`Total Applications: ${applicationCount}`);

    console.log('\n✅ Database view complete!');
    
  } catch (error) {
    console.error('❌ Error viewing database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

viewDatabase();
