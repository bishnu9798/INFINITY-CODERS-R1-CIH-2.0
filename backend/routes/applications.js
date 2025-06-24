const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application.js');
const Services = require('../models/Services.js');
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

// Apply for a service
router.post('/', authenticateToken, upload.single('resume'), [
  body('serviceId').isMongoId().withMessage('Invalid service ID format'),
  body('applicantName').notEmpty().trim().withMessage('Full name is required'),
  body('applicantEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('applicantPhone').notEmpty().trim().withMessage('Phone number is required'),
  body('applicantSkills').optional().trim(),
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
      return res.status(403).json({ error: 'Only job seekers can apply for services' });
    }

    const { serviceId, applicantName, applicantEmail, applicantPhone, applicantSkills, coverLetter } = req.body;
    const resumeFilename = req.file ? req.file.filename : null;

    // Resume is now optional - we accept direct application data
    console.log('Application data:', { applicantName, applicantEmail, applicantPhone, applicantSkills, resumeFilename });

    // Check if service exists and is active
    const service = await Services.findById(serviceId);
    if (!service || service.status !== 'active') {
      return res.status(404).json({ error: 'Service not found or not active' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      service_id: serviceId,
      jobseeker_id: req.user.userId
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this service' });
    }

    // Create new application
    const application = new Application({
      service_id: serviceId,
      jobseeker_id: req.user.userId,
      resume_filename: resumeFilename,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applicant_phone: applicantPhone,
      applicant_skills: applicantSkills || null,
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
      .populate('service_id', 'title company location experience')
      .sort({ applied_date: -1 });

    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      title: app.service_id?.title,
      company: app.service_id?.company,
      location: app.service_id?.location,
      experience: app.service_id?.experience
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get applications for a specific service (recruiter only)
router.get('/service/:serviceId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    const { serviceId } = req.params;

    // First verify the service belongs to this recruiter
    const service = await Services.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only view applications for your own services' });
    }

    // Get applications for this service with user details
    const applications = await Application.find({ service_id: serviceId })
      .populate('jobseeker_id', 'full_name email phone location skills experience education')
      .sort({ applied_date: -1 });

    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      // Use direct application data if available, fallback to user profile data
      full_name: app.applicant_name || app.jobseeker_id?.full_name,
      email: app.applicant_email || app.jobseeker_id?.email,
      phone: app.applicant_phone || app.jobseeker_id?.phone,
      skills: app.applicant_skills || app.jobseeker_id?.skills,
      user_location: app.jobseeker_id?.location,
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
  body('status').isIn(['applied', 'accepted', 'rejected'])
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

    // Verify the application belongs to a service posted by this recruiter
    const application = await Application.findById(applicationId).populate('service_id');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.service_id.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update application status
    await Application.findByIdAndUpdate(applicationId, { status });

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get all applications for recruiter's services
router.get('/recruiter/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    // First get all services posted by this recruiter
    const recruiterServices = await Services.find({ recruiter_id: req.user.userId }).select('_id');
    const serviceIds = recruiterServices.map(service => service._id);

    console.log('Recruiter services:', serviceIds.length);

    // Get all applications for these services
    const applications = await Application.find({ service_id: { $in: serviceIds } })
      .populate('service_id', 'title company')
      .populate('jobseeker_id', 'full_name email phone')
      .sort({ applied_date: -1 });

    console.log('Found applications:', applications.length);

    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      id: app._id,
      title: app.service_id?.title,
      company: app.service_id?.company,
      // Use direct application data if available, fallback to user profile data
      full_name: app.applicant_name || app.jobseeker_id?.full_name,
      email: app.applicant_email || app.jobseeker_id?.email,
      phone: app.applicant_phone || app.jobseeker_id?.phone,
      skills: app.applicant_skills || app.jobseeker_id?.skills
    }));

    console.log('Formatted applications:', formattedApplications.length);
    res.json(formattedApplications);
  } catch (error) {
    console.error('Error in /recruiter/all:', error);
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
        .populate('service_id');

      if (!application || application.service_id.recruiter_id.toString() !== req.user.userId) {
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
