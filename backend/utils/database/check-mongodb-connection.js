const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongoDBConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('Connection URI:', process.env.MONGODB_URI);
    console.log('Database Name:', process.env.DB_NAME);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'jobportal'
    });

    console.log('\n✅ Connected to MongoDB successfully!');
    console.log('🌐 Host:', conn.connection.host);
    console.log('📊 Database Name:', conn.connection.name);
    console.log('🔗 Connection State:', conn.connection.readyState);
    
    // List all collections
    console.log('\n📁 Collections in database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });

    // Get database stats
    console.log('\n📊 Database Statistics:');
    const stats = await mongoose.connection.db.stats();
    console.log('Collections:', stats.collections);
    console.log('Documents:', stats.objects);
    console.log('Data Size:', Math.round(stats.dataSize / 1024), 'KB');

    // Check each collection count
    console.log('\n🔢 Document Counts:');
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }

    // Show exact connection details for Atlas dashboard
    console.log('\n🌐 MongoDB Atlas Dashboard Info:');
    console.log('Cluster: cluster0.6tyf80w.mongodb.net');
    console.log('Database Name:', conn.connection.name);
    console.log('Username: manishkumarcse07');
    console.log('Collections to look for: users, jobs, applications');

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

checkMongoDBConnection();
