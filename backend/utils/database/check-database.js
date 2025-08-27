const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const checkDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check users
    const users = await User.find({});
    console.log('\n👥 Users in database:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.full_name} (${user.email}) - ${user.user_type}`);
    });

    // Check jobs
    const jobs = await Job.find({}).populate('recruiter_id', 'full_name company_name');
    console.log('\n💼 Jobs in database:', jobs.length);
    jobs.forEach(job => {
      console.log(`  - ${job.title} at ${job.company} (Posted by: ${job.recruiter_id?.full_name || 'Unknown'})`);
    });

    // Check applications
    const applications = await Application.find({})
      .populate('job_id', 'title company')
      .populate('jobseeker_id', 'full_name email');
    console.log('\n📄 Applications in database:', applications.length);
    applications.forEach(app => {
      console.log(`  - ${app.jobseeker_id?.full_name || 'Unknown'} applied for ${app.job_id?.title || 'Unknown Job'} (Status: ${app.status})`);
    });

    console.log('\n📊 Database Summary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Jobs: ${jobs.length}`);
    console.log(`  Applications: ${applications.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
};

// Run the check
checkDatabase();
