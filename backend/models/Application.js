const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobseeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume_filename: {
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

// Compound index to ensure unique application per job per jobseeker
applicationSchema.index({ job_id: 1, jobseeker_id: 1 }, { unique: true });

// Other indexes for performance
applicationSchema.index({ jobseeker_id: 1 });
applicationSchema.index({ job_id: 1 });
applicationSchema.index({ applied_date: -1 });
applicationSchema.index({ status: 1 });

// Transform output to match SQLite format
applicationSchema.methods.toJSON = function() {
  const application = this.toObject();
  delete application.__v;
  return application;
};

module.exports = mongoose.model('Application', applicationSchema);
