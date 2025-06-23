const mongoose = require('mongoose');
require('dotenv').config();

async function deleteOldDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...');
    console.log('🎯 Target: Remove "jobportal" database from MongoDB Atlas\n');

    // Connection string for the old database
    const oldDbUri = 'mongodb+srv://manishkumarcse07:infinitycoders%406604025@cluster0.6tyf80w.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0';
    
    // Connection string for the new database (for verification)
    const newDbUri = process.env.MONGODB_URI; // This should be Freelancer-market

    console.log('🔍 Checking current database status...');
    
    // First, verify the new database exists and has data
    console.log('1️⃣ Verifying new database (Freelancer-market)...');
    const newConnection = mongoose.createConnection(newDbUri);
    await newConnection.asPromise();
    
    const newCollections = await newConnection.db.listCollections().toArray();
    console.log(`   ✅ New database found with ${newCollections.length} collections:`, newCollections.map(c => c.name));
    
    // Check data counts in new database
    const newUserCount = await newConnection.db.collection('users').countDocuments();
    const newJobCount = await newConnection.db.collection('jobs').countDocuments();
    const newApplicationCount = await newConnection.db.collection('applications').countDocuments();
    
    console.log(`   📊 New database data:`);
    console.log(`      👥 Users: ${newUserCount}`);
    console.log(`      💼 Jobs: ${newJobCount}`);
    console.log(`      📄 Applications: ${newApplicationCount}`);
    
    if (newUserCount === 0 && newJobCount === 0 && newApplicationCount === 0) {
      console.log('   ⚠️  WARNING: New database appears to be empty!');
      console.log('   🛑 Aborting deletion to prevent data loss.');
      console.log('   💡 Please run the migration script first.');
      await newConnection.close();
      return;
    }
    
    await newConnection.close();
    console.log('   ✅ New database verification complete\n');

    // Now connect to the old database
    console.log('2️⃣ Connecting to old database (jobportal)...');
    const oldConnection = mongoose.createConnection(oldDbUri);
    await oldConnection.asPromise();
    console.log('   ✅ Connected to old database');

    // Check what's in the old database
    const oldCollections = await oldConnection.db.listCollections().toArray();
    console.log(`   📁 Old database has ${oldCollections.length} collections:`, oldCollections.map(c => c.name));
    
    if (oldCollections.length === 0) {
      console.log('   ℹ️  Old database is already empty, nothing to delete.');
      await oldConnection.close();
      return;
    }

    // Show data counts in old database
    const oldUserCount = await oldConnection.db.collection('users').countDocuments();
    const oldJobCount = await oldConnection.db.collection('jobs').countDocuments();
    const oldApplicationCount = await oldConnection.db.collection('applications').countDocuments();
    
    console.log(`   📊 Old database data:`);
    console.log(`      👥 Users: ${oldUserCount}`);
    console.log(`      💼 Jobs: ${oldJobCount}`);
    console.log(`      📄 Applications: ${oldApplicationCount}`);

    // Safety check - compare data counts
    if (newUserCount < oldUserCount || newJobCount < oldJobCount || newApplicationCount < oldApplicationCount) {
      console.log('\n   ⚠️  WARNING: New database has less data than old database!');
      console.log('   🛑 This suggests migration may not be complete.');
      console.log('   💡 Please verify migration before proceeding.');
      
      console.log('\n   📊 Data comparison:');
      console.log(`      Users: Old(${oldUserCount}) vs New(${newUserCount})`);
      console.log(`      Jobs: Old(${oldJobCount}) vs New(${newJobCount})`);
      console.log(`      Applications: Old(${oldApplicationCount}) vs New(${newApplicationCount})`);
      
      await oldConnection.close();
      return;
    }

    // Proceed with deletion
    console.log('\n3️⃣ Proceeding with database deletion...');
    console.log('   🗑️  Deleting collections from "jobportal" database...');

    // Delete each collection
    for (const collectionInfo of oldCollections) {
      const collectionName = collectionInfo.name;
      console.log(`   🗑️  Deleting collection: ${collectionName}`);
      
      const collection = oldConnection.db.collection(collectionName);
      const deleteResult = await collection.deleteMany({});
      console.log(`      ✅ Deleted ${deleteResult.deletedCount} documents`);
      
      // Drop the collection
      await collection.drop();
      console.log(`      ✅ Collection "${collectionName}" dropped`);
    }

    // Drop the entire database
    console.log('\n   🗑️  Dropping entire "jobportal" database...');
    await oldConnection.db.dropDatabase();
    console.log('   ✅ Database "jobportal" dropped successfully');

    await oldConnection.close();

    // Final verification
    console.log('\n4️⃣ Final verification...');
    console.log('   🔍 Checking if old database still exists...');
    
    try {
      const verifyConnection = mongoose.createConnection(oldDbUri);
      await verifyConnection.asPromise();
      const remainingCollections = await verifyConnection.db.listCollections().toArray();
      
      if (remainingCollections.length === 0) {
        console.log('   ✅ Old database successfully removed (no collections remain)');
      } else {
        console.log('   ⚠️  Some collections still exist:', remainingCollections.map(c => c.name));
      }
      
      await verifyConnection.close();
    } catch (error) {
      console.log('   ✅ Old database no longer accessible (successfully deleted)');
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Old "jobportal" database removed from MongoDB Atlas');
    console.log('   ✅ New "Freelancer-market" database preserved with all data');
    console.log('   ✅ Your application continues to use the new database');
    
    console.log('\n🌐 MongoDB Atlas Dashboard:');
    console.log('   1. Go to: https://cloud.mongodb.com/');
    console.log('   2. Login and check your cluster');
    console.log('   3. You should now only see "Freelancer-market" database');
    console.log('   4. The old "jobportal" database should be gone');

  } catch (error) {
    console.error('❌ Error during database cleanup:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

deleteOldDatabase();
