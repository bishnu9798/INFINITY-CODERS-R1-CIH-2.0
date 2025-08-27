const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const resetDatabase = async () => {
  try {
    console.log('🔄 RESETTING DATABASE...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections`);
    
    // Drop all collections
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`🗑️  Dropped collection: ${collection.name}`);
    }
    
    console.log('\n✅ Database reset complete!');
    console.log('📝 All data has been removed');
    console.log('🔄 You can now start fresh with new users and data');
    
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  }
};

const createSampleUsers = async () => {
  try {
    console.log('\n🔄 CREATING SAMPLE USERS...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Import User model
    const User = require('./backend/models/User');
    
    // Create sample recruiter
    const recruiterPassword = await bcrypt.hash('987654', 10);
    const recruiter = new User({
      email: 'manishmodi0408@gmail.com',
      password: recruiterPassword,
      user_type: 'recruiter',
      full_name: 'Manish Modi',
      company_name: 'Tech Solutions Inc'
    });
    await recruiter.save();
    console.log('✅ Created recruiter: manishmodi0408@gmail.com / 987654');
    
    // Create sample job seeker
    const jobseekerPassword = await bcrypt.hash('123456', 10);
    const jobseeker = new User({
      email: 'manish1@gmail.com',
      password: jobseekerPassword,
      user_type: 'jobseeker',
      full_name: 'Manish Kumar'
    });
    await jobseeker.save();
    console.log('✅ Created job seeker: manish1@gmail.com / 123456');
    
    await mongoose.connection.close();
    console.log('\n🎉 Sample users created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample users:', error.message);
  }
};

const main = async () => {
  console.log('🚀 JOB PORTAL DATABASE RESET UTILITY\n');
  console.log('This will:');
  console.log('1. Delete ALL data from the database');
  console.log('2. Create fresh sample users');
  console.log('3. Reset the application to initial state\n');
  
  await resetDatabase();
  await createSampleUsers();
  
  console.log('\n📋 RESET COMPLETE!');
  console.log('🔑 Login Credentials:');
  console.log('   Recruiter:   manishmodi0408@gmail.com / 987654');
  console.log('   Job Seeker:  manish1@gmail.com / 123456');
  console.log('\n🚀 You can now start the application with: .\\start-job-portal.bat');
};

main().catch(console.error);
