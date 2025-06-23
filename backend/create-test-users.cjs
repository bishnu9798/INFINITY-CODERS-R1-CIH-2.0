const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  user_type: {
    type: String,
    required: true,
    enum: ['jobseeker', 'recruiter']
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  company_name: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    console.log('🧹 Clearing existing users...');
    await User.deleteMany({});

    // Create test users
    console.log('👥 Creating test users...');

    // Recruiter user
    const recruiter = new User({
      email: 'manishmodi0408@gmail.com',
      password: '987654',
      user_type: 'recruiter',
      full_name: 'Manish Modi',
      company_name: 'The Tech World'
    });
    await recruiter.save();
    console.log('✅ Created recruiter:', recruiter.email);

    // Job seeker user
    const jobseeker = new User({
      email: 'manish1@gmail.com',
      password: '123456',
      user_type: 'jobseeker',
      full_name: 'Manish Kumar'
    });
    await jobseeker.save();
    console.log('✅ Created job seeker:', jobseeker.email);

    // Additional test users
    const recruiter2 = new User({
      email: 'recruiter@test.com',
      password: 'password123',
      user_type: 'recruiter',
      full_name: 'Test Recruiter',
      company_name: 'Test Company Inc'
    });
    await recruiter2.save();
    console.log('✅ Created additional recruiter:', recruiter2.email);

    const jobseeker2 = new User({
      email: 'jobseeker@test.com',
      password: 'password123',
      user_type: 'jobseeker',
      full_name: 'Test Job Seeker'
    });
    await jobseeker2.save();
    console.log('✅ Created additional job seeker:', jobseeker2.email);

    console.log('\n🎉 Test users created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Recruiter: manishmodi0408@gmail.com / 987654');
    console.log('Job Seeker: manish1@gmail.com / 123456');
    console.log('Test Recruiter: recruiter@test.com / password123');
    console.log('Test Job Seeker: jobseeker@test.com / password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

createTestUsers();
