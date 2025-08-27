const mongoose = require('mongoose');
const User = require('./models/User.js');
const Job = require('./models/Job.js');
const Application = require('./models/Application.js');
require('dotenv').config();

async function monitorRealTime() {
  try {
    console.log('🔍 Real-time MongoDB Monitor Started...\n');
    console.log('This will show you data as it gets created through the frontend.\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
    
    let lastUserCount = 0;
    let lastJobCount = 0;
    let lastAppCount = 0;
    
    // Monitor every 2 seconds
    setInterval(async () => {
      try {
        const userCount = await User.countDocuments();
        const jobCount = await Job.countDocuments();
        const appCount = await Application.countDocuments();
        
        // Check for new data
        if (userCount !== lastUserCount || jobCount !== lastJobCount || appCount !== lastAppCount) {
          console.log('\n🔄 DATABASE UPDATE DETECTED!');
          console.log('='.repeat(50));
          console.log(`📊 Current Counts:`);
          console.log(`   Users: ${userCount} (${userCount > lastUserCount ? '+' + (userCount - lastUserCount) : ''})`);
          console.log(`   Jobs: ${jobCount} (${jobCount > lastJobCount ? '+' + (jobCount - lastJobCount) : ''})`);
          console.log(`   Applications: ${appCount} (${appCount > lastAppCount ? '+' + (appCount - lastAppCount) : ''})`);
          
          // Show new users
          if (userCount > lastUserCount) {
            console.log('\n👥 NEW USERS:');
            const newUsers = await User.find({}).sort({ created_at: -1 }).limit(userCount - lastUserCount).select('-password');
            newUsers.forEach((user, index) => {
              console.log(`${index + 1}. ${user.full_name} (${user.user_type})`);
              console.log(`   Email: ${user.email}`);
              console.log(`   Company: ${user.company_name || 'N/A'}`);
              console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
            });
          }
          
          // Show new jobs
          if (jobCount > lastJobCount) {
            console.log('\n💼 NEW JOBS:');
            const newJobs = await Job.find({}).sort({ created_at: -1 }).limit(jobCount - lastJobCount).populate('recruiter_id', 'full_name');
            newJobs.forEach((job, index) => {
              console.log(`${index + 1}. ${job.title} at ${job.company}`);
              console.log(`   Posted by: ${job.recruiter_id?.full_name || 'Unknown'}`);
              console.log(`   Location: ${job.location}`);
              console.log(`   Created: ${new Date(job.created_at).toLocaleString()}`);
            });
          }
          
          // Show new applications
          if (appCount > lastAppCount) {
            console.log('\n📄 NEW APPLICATIONS:');
            const newApps = await Application.find({}).sort({ applied_date: -1 }).limit(appCount - lastAppCount)
              .populate('job_id', 'title')
              .populate('jobseeker_id', 'full_name');
            newApps.forEach((app, index) => {
              console.log(`${index + 1}. ${app.jobseeker_id?.full_name || 'Unknown'} applied for ${app.job_id?.title || 'Unknown Job'}`);
              console.log(`   Status: ${app.status}`);
              console.log(`   Applied: ${new Date(app.applied_date).toLocaleString()}`);
            });
          }
          
          console.log('\n🌐 Check MongoDB Atlas Dashboard now!');
          console.log('='.repeat(50));
          
          // Update counters
          lastUserCount = userCount;
          lastJobCount = jobCount;
          lastAppCount = appCount;
        }
      } catch (error) {
        console.error('❌ Monitor error:', error.message);
      }
    }, 2000); // Check every 2 seconds
    
    console.log('👀 Monitoring started... Create users/jobs through frontend to see updates here!');
    console.log('Press Ctrl+C to stop monitoring.\n');
    
  } catch (error) {
    console.error('❌ Error starting monitor:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Stopping monitor...');
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed');
  process.exit(0);
});

monitorRealTime();
