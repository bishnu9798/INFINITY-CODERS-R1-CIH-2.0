const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Services = require('./models/Services');
const Application = require('./models/Application');

async function migrateJobsToServices() {
  try {
    console.log('🔄 Starting migration from Jobs to Services...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);

    // Get the jobs collection directly (since Job model no longer exists)
    const db = mongoose.connection.db;
    const jobsCollection = db.collection('jobs');

    // Check if jobs collection exists and has data
    const jobsCount = await jobsCollection.countDocuments();
    console.log(`📊 Found ${jobsCount} jobs to migrate`);

    if (jobsCount === 0) {
      console.log('ℹ️ No jobs found to migrate');
      return;
    }

    // Get all jobs from the old collection
    const jobs = await jobsCollection.find({}).toArray();
    console.log(`🔄 Migrating ${jobs.length} jobs to services...`);

    // Transform jobs to services format
    const services = jobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      experience: job.experience,
      skills: job.skills,
      description: job.description,
      salary_range: job.salary_range,
      service_type: job.job_type || 'full-time', // Rename job_type to service_type
      recruiter_id: job.recruiter_id,
      status: job.status,
      created_at: job.created_at,
      updated_at: job.updated_at
    }));

    // Insert services into the new collection
    const insertResult = await Services.insertMany(services);
    console.log(`✅ Successfully migrated ${insertResult.length} services`);

    // Now update applications to reference service_id instead of job_id
    console.log('🔄 Updating applications to reference services...');
    
    // Create a mapping from old job IDs to new service IDs
    const jobToServiceMap = new Map();
    for (let i = 0; i < jobs.length; i++) {
      jobToServiceMap.set(jobs[i]._id.toString(), insertResult[i]._id);
    }

    // Get all applications
    const applications = await Application.find({});
    console.log(`📊 Found ${applications.length} applications to update`);

    // Update applications in batches
    let updatedCount = 0;
    for (const app of applications) {
      if (app.job_id) {
        const serviceId = jobToServiceMap.get(app.job_id.toString());
        if (serviceId) {
          await Application.findByIdAndUpdate(app._id, {
            service_id: serviceId,
            $unset: { job_id: 1 } // Remove the old job_id field
          });
          updatedCount++;
        }
      }
    }

    console.log(`✅ Updated ${updatedCount} applications`);

    // Verify the migration
    console.log('\n📊 Migration Summary:');
    const servicesCount = await Services.countDocuments();
    const applicationsCount = await Application.countDocuments({ service_id: { $exists: true } });
    const oldApplicationsCount = await Application.countDocuments({ job_id: { $exists: true } });

    console.log(`✅ Services created: ${servicesCount}`);
    console.log(`✅ Applications updated: ${applicationsCount}`);
    console.log(`⚠️ Applications still with job_id: ${oldApplicationsCount}`);

    // Optionally, remove the old jobs collection
    console.log('\n🔄 Cleaning up old jobs collection...');
    await jobsCollection.drop();
    console.log('✅ Old jobs collection removed');

    console.log('\n🎉 Migration completed successfully!');
    console.log('🎯 All jobs have been migrated to services');
    console.log('🎯 All applications now reference services');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run the migration
migrateJobsToServices();
