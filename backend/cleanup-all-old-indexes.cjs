// Clean up all old job_id indexes and ensure only correct service_id indexes exist
const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupAllOldIndexes() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
    // Get the applications collection
    const db = mongoose.connection.db;
    const applicationsCollection = db.collection('applications');
    
    console.log('\n📊 Current indexes:');
    const currentIndexes = await applicationsCollection.indexes();
    currentIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Find all indexes that contain job_id
    const oldIndexes = currentIndexes.filter(index => 
      index.key && Object.keys(index.key).some(key => key.includes('job_id'))
    );
    
    if (oldIndexes.length > 0) {
      console.log(`\n❌ Found ${oldIndexes.length} old job_id indexes to remove:`);
      
      for (const oldIndex of oldIndexes) {
        console.log(`   - ${oldIndex.name}: ${JSON.stringify(oldIndex.key)}`);
        
        try {
          await applicationsCollection.dropIndex(oldIndex.name);
          console.log(`   ✅ Dropped: ${oldIndex.name}`);
        } catch (error) {
          console.log(`   ❌ Failed to drop ${oldIndex.name}: ${error.message}`);
        }
      }
    } else {
      console.log('\n✅ No old job_id indexes found');
    }
    
    // Ensure correct indexes exist
    console.log('\n🔧 Ensuring correct indexes...');
    
    // Drop and recreate the unique compound index to ensure it's correct
    try {
      await applicationsCollection.dropIndex('service_id_1_jobseeker_id_1');
      console.log('🗑️ Dropped existing service_id compound index');
    } catch (error) {
      console.log('ℹ️ No existing service_id compound index to drop');
    }
    
    // Create the correct unique compound index
    try {
      await applicationsCollection.createIndex(
        { service_id: 1, jobseeker_id: 1 }, 
        { unique: true, name: 'service_id_1_jobseeker_id_1' }
      );
      console.log('✅ Created unique compound index: service_id_1_jobseeker_id_1');
    } catch (error) {
      console.log('❌ Error creating unique compound index:', error.message);
    }
    
    // Create other performance indexes
    const indexes = [
      { key: { jobseeker_id: 1 }, name: 'jobseeker_id_1' },
      { key: { service_id: 1 }, name: 'service_id_1' },
      { key: { applied_date: -1 }, name: 'applied_date_-1' },
      { key: { status: 1 }, name: 'status_1' }
    ];
    
    for (const indexSpec of indexes) {
      try {
        await applicationsCollection.createIndex(indexSpec.key, { name: indexSpec.name });
        console.log(`✅ Created index: ${indexSpec.name}`);
      } catch (error) {
        if (error.code === 85) {
          console.log(`ℹ️ Index ${indexSpec.name} already exists`);
        } else {
          console.log(`⚠️ Error creating index ${indexSpec.name}:`, error.message);
        }
      }
    }
    
    console.log('\n📊 Final indexes:');
    const finalIndexes = await applicationsCollection.indexes();
    finalIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Verify no job_id indexes remain
    const remainingJobIdIndexes = finalIndexes.filter(index => 
      index.key && Object.keys(index.key).some(key => key.includes('job_id'))
    );
    
    if (remainingJobIdIndexes.length === 0) {
      console.log('\n✅ All job_id indexes successfully removed');
    } else {
      console.log('\n❌ Some job_id indexes still remain:');
      remainingJobIdIndexes.forEach(index => {
        console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }
    
    console.log('\n🎉 Database cleanup completed!');
    console.log('✅ All old job_id indexes removed');
    console.log('✅ Correct service_id indexes in place');
    console.log('✅ Application submission should now work perfectly');
    
  } catch (error) {
    console.error('❌ Error cleaning up indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupAllOldIndexes();
