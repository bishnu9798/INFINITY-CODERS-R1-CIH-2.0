const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
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
  job_type: {
    type: String,
    default: 'full-time',
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
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
jobSchema.index({ recruiter_id: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ created_at: -1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' }); // For text search

// Transform output to match SQLite format
jobSchema.methods.toJSON = function() {
  const job = this.toObject();
  delete job.__v;
  return job;
};

module.exports = mongoose.model('Job', jobSchema);
