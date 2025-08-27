const mongoose = require('mongoose');

async function debugSimple() {
  try {
    // Direct connection string
    const connectionString = 'mongodb+srv://manishkumarcse07:manishkaju1234554321@cluster0.u1j1h2t.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB');
    
    // Get collections
    const db = mongoose.connection.db;
    
    console.log('\n👥 USERS:');
    const users = await db.collection('users').find({}).toArray();
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.full_name} (${user.user_type})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });
    
    console.log('\n💼 JOBS:');
    const jobs = await db.collection('jobs').find({}).toArray();
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company}`);
      console.log(`   ID: ${job._id}`);
      console.log(`   Recruiter ID: ${job.recruiter_id}`);
      console.log('');
    });
    
    console.log('\n📄 APPLICATIONS:');
    const applications = await db.collection('applications').find({}).toArray();
    if (applications.length === 0) {
      console.log('No applications found');
    } else {
      applications.forEach((app, index) => {
        console.log(`${index + 1}. Application ID: ${app._id}`);
        console.log(`   Job ID: ${app.job_id}`);
        console.log(`   Jobseeker ID: ${app.jobseeker_id}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

debugSimple();
