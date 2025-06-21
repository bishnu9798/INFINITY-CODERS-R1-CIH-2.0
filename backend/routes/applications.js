const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application.js');
const Job = require('../models/Job.js');
const User = require('../models/User.js');
const { authenticateToken } = require('../middleware/auth.js');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log('File filter check:', { filename: file.originalname, mimetype: file.mimetype });
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Apply for a job
router.post('/', authenticateToken, upload.single('resume'), [
  body('jobId').isMongoId().withMessage('Invalid job ID format'),
  body('coverLetter').optional().trim()
], async (req, res) => {
  try {
    console.log('Application request received:', {
      user: req.user.email,
      body: req.body,
      file: req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : null
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Application validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'jobseeker') {
      console.log('Non-jobseeker trying to apply:', req.user.userType);
      return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
    }

    const { jobId, coverLetter } = req.body;
    const resumeFilename = req.file ? req.file.filename : null;

    if (!resumeFilename) {
      console.log('No resume file uploaded');
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not found or not active' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job_id: jobId,
      jobseeker_id: req.user.userId
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create new application
    const application = new Application({
      job_id: jobId,
      jobseeker_id: req.user.userId,
      resume_filename: resumeFilename,
      cover_letter: coverLetter || null
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get applications for a job seeker
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can access this endpoint' });
    }

    const applications = await Application.find({ jobseeker_id: req.user.userId })
      .populate('job_id', 'title company location experience')
      .sort({ applied_date: -1 });

    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      title: app.job_id?.title,
      company: app.job_id?.company,
      location: app.job_id?.location,
      experience: app.job_id?.experience
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get applications for a specific job (recruiter only)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    const { jobId } = req.params;

    // First verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only view applications for your own jobs' });
    }

    // Get applications for this job with user details
    const applications = await Application.find({ job_id: jobId })
      .populate('jobseeker_id', 'full_name email phone location skills experience education')
      .sort({ applied_date: -1 });

    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      full_name: app.jobseeker_id?.full_name,
      email: app.jobseeker_id?.email,
      phone: app.jobseeker_id?.phone,
      user_location: app.jobseeker_id?.location,
      skills: app.jobseeker_id?.skills,
      user_experience: app.jobseeker_id?.experience,
      education: app.jobseeker_id?.education
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update application status (recruiter only)
router.put('/:applicationId/status', authenticateToken, [
  body('status').isIn(['applied', 'shortlisted', 'rejected', 'hired'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can update application status' });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    // Verify the application belongs to a job posted by this recruiter
    const application = await Application.findById(applicationId).populate('job_id');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job_id.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update application status
    await Application.findByIdAndUpdate(applicationId, { status });

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get all applications for recruiter's jobs
router.get('/recruiter/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    // Get all applications for jobs posted by this recruiter
    const applications = await Application.find({})
      .populate({
        path: 'job_id',
        match: { recruiter_id: req.user.userId },
        select: 'title company'
      })
      .populate('jobseeker_id', 'full_name email phone')
      .sort({ applied_date: -1 });

    // Filter out applications where job_id is null (not recruiter's jobs)
    const filteredApplications = applications.filter(app => app.job_id !== null);

    const formattedApplications = filteredApplications.map(app => ({
      ...app.toObject(),
      title: app.job_id?.title,
      company: app.job_id?.company,
      full_name: app.jobseeker_id?.full_name,
      email: app.jobseeker_id?.email,
      phone: app.jobseeker_id?.phone
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Download resume
router.get('/resume/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    const fs = require('fs');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    // For job seekers, only allow downloading their own resumes
    // For recruiters, allow downloading resumes for applications to their jobs
    if (req.user.userType === 'jobseeker') {
      const application = await Application.findOne({
        jobseeker_id: req.user.userId,
        resume_filename: filename
      });

      if (!application) {
        return res.status(403).json({ error: 'Access denied' });
      }
      res.download(filePath);

    } else if (req.user.userType === 'recruiter') {
      const application = await Application.findOne({ resume_filename: filename })
        .populate('job_id');

      if (!application || application.job_id.recruiter_id.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      res.download(filePath);

    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
