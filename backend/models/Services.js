const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  salary_range: {
    type: String,
    trim: true
  },
  service_type: {
    type: String,
    default: 'full-time',
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hourly']
  },
  // Freelancer contact information
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  // Resume/Portfolio file information
  resume_filename: {
    type: String,
    trim: true
  },
  resume_file_size: {
    type: Number
  },
  resume_original_name: {
    type: String,
    trim: true
  },
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'closed', 'draft']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better performance
servicesSchema.index({ recruiter_id: 1 });
servicesSchema.index({ status: 1 });
servicesSchema.index({ created_at: -1 });
servicesSchema.index({ title: 'text', description: 'text', skills: 'text' }); // For text search

// Transform output to match SQLite format
servicesSchema.methods.toJSON = function() {
  const service = this.toObject();
  delete service.__v;
  return service;
};

module.exports = mongoose.model('Services', servicesSchema);
