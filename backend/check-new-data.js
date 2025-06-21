const mongoose = require('mongoose');
const User = require('./models/User.js');
const Job = require('./models/Job.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function checkNewData() {
  try {
    console.log('🔍 Checking for NEW data created through frontend...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all data with timestamps
    console.log('\n👥 USERS (sorted by creation time):');
    console.log('='.repeat(60));
    const users = await User.find({}).sort({ created_at: -1 }).select('-password');
    
    if (users.length === 0) {
      console.log('❌ No users found - frontend registration might not be working');
    } else {
      users.forEach((user, index) => {
        const timeAgo = Math.round((Date.now() - new Date(user.created_at)) / 1000 / 60);
        console.log(`${index + 1}. ${user.full_name} (${user.user_type})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Company: ${user.company_name || 'N/A'}`);
        console.log(`   Created: ${timeAgo} minutes ago`);
        console.log('');
      });
    }
    
    console.log('\n💼 JOBS (sorted by creation time):');
    console.log('='.repeat(60));
    const jobs = await Job.find({}).sort({ created_at: -1 }).populate('recruiter_id', 'full_name');
    
    if (jobs.length === 0) {
      console.log('❌ No jobs found - job posting might not be working');
    } else {
      jobs.forEach((job, index) => {
        const timeAgo = Math.round((Date.now() - new Date(job.created_at)) / 1000 / 60);
        console.log(`${index + 1}. ${job.title} at ${job.company}`);
        console.log(`   Posted by: ${job.recruiter_id?.full_name || 'Unknown'}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Created: ${timeAgo} minutes ago`);
        console.log('');
      });
    }
    
    console.log('\n📄 APPLICATIONS (sorted by creation time):');
    console.log('='.repeat(60));
    const applications = await Application.find({}).sort({ applied_date: -1 })
      .populate('job_id', 'title')
      .populate('jobseeker_id', 'full_name');
    
    if (applications.length === 0) {
      console.log('❌ No applications found');
    } else {
      applications.forEach((app, index) => {
        const timeAgo = Math.round((Date.now() - new Date(app.applied_date)) / 1000 / 60);
        console.log(`${index + 1}. ${app.jobseeker_id?.full_name || 'Unknown'} applied for ${app.job_id?.title || 'Unknown Job'}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Applied: ${timeAgo} minutes ago`);
        console.log('');
      });
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Jobs: ${jobs.length}`);
    console.log(`Total Applications: ${applications.length}`);
    
    if (users.length === 0) {
      console.log('\n🚨 ISSUE: No users found!');
      console.log('This means frontend registration is not working properly.');
      console.log('Check the browser console for errors when registering.');
    }
    
    if (jobs.length === 0 && users.some(u => u.user_type === 'recruiter')) {
      console.log('\n🚨 ISSUE: Recruiters exist but no jobs found!');
      console.log('This means job posting is not working properly.');
      console.log('Check the browser console for errors when posting jobs.');
    }
    
    console.log('\n🌐 MongoDB Atlas Dashboard:');
    console.log('Go to: https://cloud.mongodb.com/');
    console.log('Database: jobportal');
    console.log('Collections: users, jobs, applications');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

checkNewData();
