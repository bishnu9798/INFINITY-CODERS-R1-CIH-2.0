const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas directly in this file
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  user_type: String,
  full_name: String,
  company_name: String,
  created_at: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  experience: String,
  skills: String,
  description: String,
  salary_range: String,
  job_type: String,
  recruiter_id: mongoose.Schema.Types.ObjectId,
  status: String,
  created_at: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  job_id: mongoose.Schema.Types.ObjectId,
  jobseeker_id: mongoose.Schema.Types.ObjectId,
  resume_filename: String,
  cover_letter: String,
  status: String,
  applied_date: { type: Date, default: Date.now }
});

async function forceWriteToAtlas() {
  try {
    // Connect with database name in the URI
    const connectionString = `mongodb+srv://manishkumarcse07:infinitycoders%406604025@cluster0.6tyf80w.mongodb.net/Freelancer-market?retryWrites=true&w=majority&appName=Cluster0`;
    
    console.log('🔄 Connecting to MongoDB Atlas with explicit database name...');
    await mongoose.connect(connectionString);
    
    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    
    // Create models
    const User = mongoose.model('User', userSchema);
    const Job = mongoose.model('Job', jobSchema);
    const Application = mongoose.model('Application', applicationSchema);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    
    // Create test data that should definitely show up in Atlas
    console.log('📝 Creating test data for Atlas dashboard...');
    
    const testUser = new User({
      email: 'atlas.test@example.com',
      password: 'hashedpassword',
      user_type: 'recruiter',
      full_name: 'Atlas Test User',
      company_name: 'Atlas Test Company'
    });
    await testUser.save();
    
    const testJob = new Job({
      title: 'Atlas Test Job',
      company: 'Atlas Test Company',
      location: 'Atlas City',
      experience: '1-2 years',
      skills: 'MongoDB,Atlas,Testing',
      description: 'This is a test job to verify Atlas dashboard connectivity',
      salary_range: '$50,000 - $70,000',
      job_type: 'full-time',
      recruiter_id: testUser._id,
      status: 'active'
    });
    await testJob.save();
    
    const testApplication = new Application({
      job_id: testJob._id,
      jobseeker_id: testUser._id,
      resume_filename: 'atlas_test_resume.pdf',
      cover_letter: 'This is a test application for Atlas dashboard verification',
      status: 'applied'
    });
    await testApplication.save();
    
    // Verify data was written
    console.log('\n✅ Test data created successfully!');
    
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const appCount = await Application.countDocuments();
    
    console.log(`📊 Verification:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Jobs: ${jobCount}`);
    console.log(`   Applications: ${appCount}`);
    
    console.log('\n🌐 Now check MongoDB Atlas Dashboard:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Login with: manishkumarcse07 / manishkaju1234554321');
    console.log('3. Click on Cluster0');
    console.log('4. Click "Browse Collections"');
    console.log('5. Look for database: "jobportal"');
    console.log('6. You should see: users, jobs, applications collections');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

forceWriteToAtlas();
