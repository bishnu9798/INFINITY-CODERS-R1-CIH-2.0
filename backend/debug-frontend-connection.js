const mongoose = require('mongoose');
const User = require('./models/User.js');
const Job = require('./models/Job.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function debugFrontendConnection() {
  try {
    console.log('🔍 Debugging Frontend-Backend Connection...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear ALL existing data to start fresh
    console.log('\n🧹 Clearing ALL existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('✅ All data cleared');
    
    // Check if data is really cleared
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const appCount = await Application.countDocuments();
    
    console.log('\n📊 Database Status After Clearing:');
    console.log(`Users: ${userCount}`);
    console.log(`Jobs: ${jobCount}`);
    console.log(`Applications: ${appCount}`);
    
    if (userCount === 0 && jobCount === 0 && appCount === 0) {
      console.log('✅ Database is completely clean');
    } else {
      console.log('❌ Database still has data - there might be an issue');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Now go to your frontend application: http://localhost:5174/');
    console.log('2. Register a new user account');
    console.log('3. Create some jobs (if recruiter)');
    console.log('4. Check MongoDB Atlas dashboard');
    console.log('5. Run: node check-new-data.js to verify');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

debugFrontendConnection();
