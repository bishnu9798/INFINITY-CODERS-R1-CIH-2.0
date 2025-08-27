const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');

// Test different connection strings
const testConnections = [
  // Original connection string
  process.env.MONGODB_URI,
  
  // Alternative connection strings to try
  'mongodb+srv://manishkumarcse07:infinitycoders@660402@cluster0.6tyf80w.mongodb.net/freelancer-marketplace?retryWrites=true&w=majority',
  'mongodb+srv://manishkumarcse07:infinitycoders%40660402@cluster0.6tyf80w.mongodb.net/freelancer-marketplace?retryWrites=true&w=majority',
  
  // Fallback to a demo database (if needed)
  'mongodb+srv://demo:demo123@cluster0.mongodb.net/freelancer-marketplace?retryWrites=true&w=majority'
];

async function testConnection(uri, index) {
  try {
    console.log(`\n🔄 Testing connection ${index + 1}...`);
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    console.log(`✅ Connection ${index + 1} successful!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log(`❌ Connection ${index + 1} failed:`, error.message);
    return false;
  }
}

async function runTests() {
  for (let i = 0; i < testConnections.length; i++) {
    if (testConnections[i]) {
      const success = await testConnection(testConnections[i], i);
      if (success) {
        console.log(`\n🎯 Working connection string found at index ${i + 1}:`);
        console.log(testConnections[i]);
        break;
      }
    }
  }
  
  console.log('\n🏁 Connection test completed.');
  process.exit(0);
}

runTests();
