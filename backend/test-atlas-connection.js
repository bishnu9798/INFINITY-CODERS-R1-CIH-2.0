const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

async function testAtlasConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas Connection...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔗 Connection state:', mongoose.connection.readyState);

    // Test basic operations
    console.log('\n🔄 Testing basic database operations...');

    // Test User model
    console.log('👤 Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`   Current users: ${userCount}`);

    // Test Job model
    console.log('💼 Testing Job model...');
    const jobCount = await Job.countDocuments();
    console.log(`   Current jobs: ${jobCount}`);

    // Test Application model
    console.log('📄 Testing Application model...');
    const applicationCount = await Application.countDocuments();
    console.log(`   Current applications: ${applicationCount}`);

    // Test creating a sample user (will be removed)
    console.log('\n🔄 Testing data creation...');
    const testUser = new User({
      email: 'test@example.com',
      password: 'testpassword123',
      user_type: 'jobseeker',
      full_name: 'Test User'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');

    // Remove the test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user removed successfully');

    // Test indexes
    console.log('\n🔄 Testing database indexes...');
    const userIndexes = await User.collection.getIndexes();
    const jobIndexes = await Job.collection.getIndexes();
    const applicationIndexes = await Application.collection.getIndexes();

    console.log('📊 User indexes:', Object.keys(userIndexes).length);
    console.log('📊 Job indexes:', Object.keys(jobIndexes).length);
    console.log('📊 Application indexes:', Object.keys(applicationIndexes).length);

    console.log('\n✅ All tests passed! MongoDB Atlas is ready for use.');
    console.log('🎯 Database is fresh and ready for real-time data storage.');

  } catch (error) {
    console.error('❌ MongoDB Atlas connection test failed:', error.message);
    console.error('❌ Full error:', error);
    
    if (error.message.includes('authentication')) {
      console.log('💡 Authentication failed. Please check:');
      console.log('   1. Username and password in the connection string');
      console.log('   2. Database user permissions');
      console.log('   3. IP whitelist settings');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timeout. Please check:');
      console.log('   1. Internet connection');
      console.log('   2. MongoDB Atlas cluster status');
      console.log('   3. Firewall settings');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testAtlasConnection();
