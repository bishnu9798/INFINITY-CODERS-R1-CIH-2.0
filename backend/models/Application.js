const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Services',
    required: true
  },
  jobseeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Resume file (optional - for backward compatibility)
  resume_filename: {
    type: String,
    trim: true
  },
  // Direct application fields (new approach)
  applicant_name: {
    type: String,
    trim: true
  },
  applicant_email: {
    type: String,
    trim: true,
    lowercase: true
  },
  applicant_phone: {
    type: String,
    trim: true
  },
  applicant_skills: {
    type: String,
    trim: true
  },
  cover_letter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'applied',
    enum: ['applied', 'shortlisted', 'rejected', 'hired']
  },
  applied_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Compound index to ensure unique application per service per jobseeker
applicationSchema.index({ service_id: 1, jobseeker_id: 1 }, { unique: true });

// Other indexes for performance
applicationSchema.index({ jobseeker_id: 1 });
applicationSchema.index({ service_id: 1 });
applicationSchema.index({ applied_date: -1 });
applicationSchema.index({ status: 1 });

// Transform output to match SQLite format
applicationSchema.methods.toJSON = function() {
  const application = this.toObject();
  delete application.__v;
  return application;
};

module.exports = mongoose.model('Application', applicationSchema);
