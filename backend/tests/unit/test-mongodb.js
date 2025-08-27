const mongoose = require('mongoose');
const User = require('./models/User.js');
const Job = require('./models/Job.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function testMongoDB() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'jobportal'
    });
    console.log('✅ Connected to MongoDB successfully!');

    // Test User creation
    console.log('\n🔄 Testing User model...');
    const testUser = new User({
      email: 'test@example.com',
      password: 'testpassword123',
      user_type: 'jobseeker',
      full_name: 'Test User'
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
    } else {
      await testUser.save();
      console.log('✅ Test user created successfully');
    }

    // Test Job creation
    console.log('\n🔄 Testing Job model...');
    const testJob = new Job({
      title: 'Test Developer',
      company: 'Test Company',
      location: 'Test City',
      experience: '1-2 years',
      skills: 'JavaScript,Node.js',
      description: 'This is a test job posting',
      recruiter_id: testUser._id
    });

    const existingJob = await Job.findOne({ title: 'Test Developer' });
    if (existingJob) {
      console.log('✅ Test job already exists');
    } else {
      await testJob.save();
      console.log('✅ Test job created successfully');
    }

    // Test queries
    console.log('\n🔄 Testing queries...');
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();

    console.log(`📊 Database Statistics:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Jobs: ${jobCount}`);
    console.log(`   Applications: ${applicationCount}`);

    console.log('\n✅ All MongoDB tests passed!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

testMongoDB();
