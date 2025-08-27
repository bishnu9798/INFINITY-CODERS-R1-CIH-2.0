const mongoose = require('mongoose');
require('dotenv').config();

async function viewDatabaseContents() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get database name and connection info
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    
    console.log('\n🌐 Database Connection Info:');
    console.log(`   Host: ${host}`);
    console.log(`   Database Name: ${dbName}`);
    console.log(`   Connection URI: ${process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // List all collections
    console.log('\n📁 Collections in database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    // Check each collection for data
    console.log('\n📊 Collection Details:');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      console.log(`\n📋 ${collectionName.toUpperCase()} Collection:`);
      console.log(`   Documents: ${count}`);
      
      if (count > 0) {
        // Get sample documents
        const sampleDocs = await mongoose.connection.db.collection(collectionName).find({}).limit(3).toArray();
        
        sampleDocs.forEach((doc, index) => {
          console.log(`\n   Document ${index + 1}:`);
          
          if (collectionName === 'users') {
            console.log(`     ID: ${doc._id}`);
            console.log(`     Email: ${doc.email}`);
            console.log(`     Name: ${doc.full_name}`);
            console.log(`     Type: ${doc.user_type}`);
            console.log(`     Company: ${doc.company_name || 'N/A'}`);
            console.log(`     Created: ${doc.created_at || doc.createdAt}`);
          } else if (collectionName === 'jobs') {
            console.log(`     ID: ${doc._id}`);
            console.log(`     Title: ${doc.title}`);
            console.log(`     Company: ${doc.company}`);
            console.log(`     Location: ${doc.location}`);
            console.log(`     Experience: ${doc.experience}`);
            console.log(`     Skills: ${doc.skills}`);
            console.log(`     Recruiter ID: ${doc.recruiter_id}`);
            console.log(`     Status: ${doc.status}`);
            console.log(`     Created: ${doc.created_at || doc.createdAt}`);
          } else if (collectionName === 'applications') {
            console.log(`     ID: ${doc._id}`);
            console.log(`     Job ID: ${doc.job_id}`);
            console.log(`     Job Seeker ID: ${doc.jobseeker_id}`);
            console.log(`     Resume: ${doc.resume_filename}`);
            console.log(`     Status: ${doc.status}`);
            console.log(`     Applied: ${doc.applied_date || doc.created_at || doc.createdAt}`);
          } else {
            // For other collections, show basic info
            console.log(`     ID: ${doc._id}`);
            const keys = Object.keys(doc).filter(key => key !== '_id' && key !== '__v').slice(0, 5);
            keys.forEach(key => {
              console.log(`     ${key}: ${doc[key]}`);
            });
          }
        });
        
        if (count > 3) {
          console.log(`   ... and ${count - 3} more documents`);
        }
      }
    }
    
    // Summary
    console.log('\n📈 Database Summary:');
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    const jobCount = await mongoose.connection.db.collection('jobs').countDocuments();
    const applicationCount = await mongoose.connection.db.collection('applications').countDocuments();
    
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   💼 Total Jobs: ${jobCount}`);
    console.log(`   📄 Total Applications: ${applicationCount}`);
    
    // Show MongoDB Atlas dashboard info
    console.log('\n🌐 MongoDB Atlas Dashboard Access:');
    console.log('   1. Go to: https://cloud.mongodb.com/');
    console.log('   2. Login with your MongoDB Atlas account');
    console.log('   3. Click on your cluster (cluster0.6tyf80w.mongodb.net)');
    console.log('   4. Click "Browse Collections"');
    console.log(`   5. Look for database: "${dbName}"`);
    console.log('   6. You should see these collections:');
    collections.forEach(collection => {
      console.log(`      - ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error viewing database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

viewDatabaseContents();
