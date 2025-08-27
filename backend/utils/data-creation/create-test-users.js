const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const createTestUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ 
      email: { $in: ['manishmodi0408@gmail.com', 'manish1@gmail.com'] } 
    });
    console.log('🧹 Cleared existing test users');

    // Create recruiter user
    const recruiterUser = new User({
      email: 'manishmodi0408@gmail.com',
      password: '987654', // Will be hashed automatically
      user_type: 'recruiter',
      full_name: 'Manish Modi',
      company_name: 'The Tech World'
    });

    await recruiterUser.save();
    console.log('✅ Created recruiter user:', recruiterUser.email);

    // Create job seeker user
    const jobseekerUser = new User({
      email: 'manish1@gmail.com',
      password: '123456', // Will be hashed automatically
      user_type: 'jobseeker',
      full_name: 'Manish Kumar'
    });

    await jobseekerUser.save();
    console.log('✅ Created job seeker user:', jobseekerUser.email);

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👔 Recruiter: manishmodi0408@gmail.com / 987654');
    console.log('👤 Job Seeker: manish1@gmail.com / 123456');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
