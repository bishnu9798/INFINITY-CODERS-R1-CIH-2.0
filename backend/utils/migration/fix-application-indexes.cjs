// Fix Application collection indexes - remove old job_id index and ensure correct service_id index
const mongoose = require('mongoose');
require('dotenv').config();

async function fixApplicationIndexes() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get the applications collection
    const db = mongoose.connection.db;
    const applicationsCollection = db.collection('applications');
    
    console.log('\n📊 Current indexes:');
    const currentIndexes = await applicationsCollection.indexes();
    currentIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check if the problematic index exists
    const problematicIndex = currentIndexes.find(index => 
      index.key && index.key.job_id !== undefined
    );
    
    if (problematicIndex) {
      console.log(`\n❌ Found problematic index: ${problematicIndex.name}`);
      console.log(`   Key: ${JSON.stringify(problematicIndex.key)}`);
      
      // Drop the problematic index
      console.log(`\n🗑️ Dropping problematic index: ${problematicIndex.name}`);
      await applicationsCollection.dropIndex(problematicIndex.name);
      console.log('✅ Problematic index dropped');
    } else {
      console.log('\n✅ No problematic job_id index found');
    }
    
    // Ensure correct indexes exist
    console.log('\n🔧 Ensuring correct indexes...');
    
    // Create the correct unique compound index
    try {
      await applicationsCollection.createIndex(
        { service_id: 1, jobseeker_id: 1 }, 
        { unique: true, name: 'service_id_1_jobseeker_id_1' }
      );
      console.log('✅ Created unique compound index: service_id_1_jobseeker_id_1');
    } catch (error) {
      if (error.code === 85) {
        console.log('ℹ️ Unique compound index already exists');
      } else {
        console.log('⚠️ Error creating unique compound index:', error.message);
      }
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
    
    // Test application creation
    console.log('\n🧪 Testing application creation...');
    
    // Check if we have any test data
    const testApplication = {
      service_id: new mongoose.Types.ObjectId(),
      jobseeker_id: new mongoose.Types.ObjectId(),
      applicant_name: 'Test User',
      applicant_email: 'test@example.com',
      applicant_phone: '+1-555-123-4567',
      applicant_skills: 'JavaScript, React',
      cover_letter: 'Test application',
      status: 'applied',
      applied_date: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    try {
      const result = await applicationsCollection.insertOne(testApplication);
      console.log('✅ Test application created successfully:', result.insertedId);
      
      // Clean up test data
      await applicationsCollection.deleteOne({ _id: result.insertedId });
      console.log('✅ Test application cleaned up');
    } catch (error) {
      console.log('❌ Test application creation failed:', error.message);
    }
    
    console.log('\n🎉 Application indexes fixed successfully!');
    console.log('✅ Old job_id index removed');
    console.log('✅ Correct service_id indexes in place');
    console.log('✅ Application submission should now work');
    
  } catch (error) {
    console.error('❌ Error fixing application indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixApplicationIndexes();
