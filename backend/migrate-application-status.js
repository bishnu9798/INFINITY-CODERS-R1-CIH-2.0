const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const connectDB = require('./database/mongodb.js');

// Import the Application model
const Application = require('./models/Application.js');

async function migrateApplicationStatus() {
  try {
    console.log('🔄 Starting Application Status Migration...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find all applications with old status values
    const applicationsToUpdate = await Application.find({
      status: { $in: ['shortlisted', 'hired'] }
    });

    console.log(`📊 Found ${applicationsToUpdate.length} applications to migrate`);

    if (applicationsToUpdate.length === 0) {
      console.log('✅ No applications need migration');
      process.exit(0);
    }

    // Migration mapping
    const statusMapping = {
      'shortlisted': 'accepted',
      'hired': 'accepted'
    };

    let migratedCount = 0;

    for (const application of applicationsToUpdate) {
      const oldStatus = application.status;
      const newStatus = statusMapping[oldStatus];

      if (newStatus) {
        await Application.findByIdAndUpdate(application._id, {
          status: newStatus
        });

        console.log(`✅ Migrated application ${application._id}: ${oldStatus} → ${newStatus}`);
        migratedCount++;
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Total applications migrated: ${migratedCount}`);
    console.log(`\n📋 Status mapping applied:`);
    console.log(`   'shortlisted' → 'accepted'`);
    console.log(`   'hired' → 'accepted'`);
    console.log(`   'applied' → unchanged`);
    console.log(`   'rejected' → unchanged`);

    // Verify migration
    console.log(`\n🔍 Verifying migration...`);
    const remainingOldStatus = await Application.find({
      status: { $in: ['shortlisted', 'hired'] }
    });

    if (remainingOldStatus.length === 0) {
      console.log('✅ Migration verification successful - no old status values found');
    } else {
      console.log(`❌ Migration verification failed - ${remainingOldStatus.length} applications still have old status values`);
    }

    // Show current status distribution
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(`\n📊 Current status distribution:`);
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count} applications`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateApplicationStatus();
}

module.exports = migrateApplicationStatus;
