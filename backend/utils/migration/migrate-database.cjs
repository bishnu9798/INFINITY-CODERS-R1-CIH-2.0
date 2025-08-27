const mongoose = require('mongoose');
require('dotenv').config();

async function migrateDatabaseName() {
  try {
    console.log('🔄 Starting database migration...');
    console.log('📋 Migration: jobportal → Freelancer-market\n');

    // Connection strings
    const oldDbUri = 'mongodb+srv://manishkumarcse07:infinitycoders%406604025@cluster0.6tyf80w.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0';
    const newDbUri = 'mongodb+srv://manishkumarcse07:infinitycoders%406604025@cluster0.6tyf80w.mongodb.net/Freelancer-market?retryWrites=true&w=majority&appName=Cluster0';

    // Connect to old database
    console.log('🔌 Connecting to old database (jobportal)...');
    const oldConnection = mongoose.createConnection(oldDbUri);
    await oldConnection.asPromise();
    console.log('✅ Connected to old database');

    // Connect to new database
    console.log('🔌 Connecting to new database (Freelancer-market)...');
    const newConnection = mongoose.createConnection(newDbUri);
    await newConnection.asPromise();
    console.log('✅ Connected to new database');

    // Get collections from old database
    console.log('\n📁 Getting collections from old database...');
    const collections = await oldConnection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`, collections.map(c => c.name));

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📦 Migrating collection: ${collectionName}`);

      // Get all documents from old collection
      const oldCollection = oldConnection.db.collection(collectionName);
      const documents = await oldCollection.find({}).toArray();
      
      console.log(`   Found ${documents.length} documents`);

      if (documents.length > 0) {
        // Insert documents into new collection
        const newCollection = newConnection.db.collection(collectionName);
        
        // Clear new collection first (in case it exists)
        await newCollection.deleteMany({});
        
        // Insert all documents
        await newCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${documents.length} documents`);

        // Show sample data
        if (collectionName === 'users') {
          const sampleUsers = documents.slice(0, 2);
          sampleUsers.forEach((user, index) => {
            console.log(`      User ${index + 1}: ${user.email} (${user.user_type})`);
          });
        } else if (collectionName === 'jobs') {
          const sampleJobs = documents.slice(0, 2);
          sampleJobs.forEach((job, index) => {
            console.log(`      Job ${index + 1}: ${job.title} at ${job.company}`);
          });
        } else if (collectionName === 'applications') {
          console.log(`      Applications: ${documents.length} job applications migrated`);
        }
      } else {
        console.log(`   ⚠️  No documents to migrate`);
      }
    }

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const newCollections = await newConnection.db.listCollections().toArray();
    
    for (const collectionInfo of newCollections) {
      const collectionName = collectionInfo.name;
      const count = await newConnection.db.collection(collectionName).countDocuments();
      console.log(`   ✅ ${collectionName}: ${count} documents`);
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    const userCount = await newConnection.db.collection('users').countDocuments();
    const jobCount = await newConnection.db.collection('jobs').countDocuments();
    const applicationCount = await newConnection.db.collection('applications').countDocuments();
    
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   💼 Jobs: ${jobCount}`);
    console.log(`   📄 Applications: ${applicationCount}`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Your application will now use the "Freelancer-market" database');
    console.log('   2. All existing data has been copied to the new database');
    console.log('   3. You can safely delete the old "jobportal" database if needed');
    console.log('   4. Restart your application to use the new database');

    // Close connections
    await oldConnection.close();
    await newConnection.close();
    console.log('\n🔌 Database connections closed');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

migrateDatabaseName();
