const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Services = require('../models/Services.js');
const User = require('../models/User.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type - allow PDF, DOC, DOCX, and TXT for testing
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) ||
                     file.mimetype === 'application/pdf' ||
                     file.mimetype === 'application/msword' ||
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     file.mimetype === 'text/plain';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { search, location, experience } = req.query;
    let filter = { status: 'active' };

    // Build search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      filter.experience = experience;
    }

    const services = await Services.find(filter)
      .populate('recruiter_id', 'full_name company_name')
      .sort({ created_at: -1 });

    const formattedServices = services.map(service => ({
      ...service.toObject(),
      recruiter_name: service.recruiter_id?.full_name,
      company_name: service.recruiter_id?.company_name,
      skills: service.skills ? service.skills.split(',') : []
    }));

    res.json(formattedServices);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findById(id)
      .populate('recruiter_id', 'full_name company_name');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const formattedService = {
      ...service.toObject(),
      recruiter_name: service.recruiter_id?.full_name,
      company_name: service.recruiter_id?.company_name,
      skills: service.skills ? service.skills.split(',') : []
    };

    res.json(formattedService);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create service (recruiter only)
router.post('/', authenticateToken, upload.single('resume'), [
  body('title').notEmpty().trim(),
  body('company').notEmpty().trim(),
  body('location').notEmpty().trim(),
  body('experience').notEmpty(),
  body('skills').notEmpty(),
  body('description').notEmpty().trim(),
  body('mobile').notEmpty().trim(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    console.log('Service creation request received:', {
      user: req.user.email,
      body: req.body,
      file: req.file ? { filename: req.file.filename, size: req.file.size } : null
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Service validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'recruiter') {
      console.log('Non-recruiter trying to post service:', req.user.userType);
      return res.status(403).json({ error: 'Only recruiters can post services' });
    }

    const { title, company, location, experience, skills, description, salaryRange, serviceType, mobile, email } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;
    const resumeFile = req.file;

    console.log('Service data:', { title, company, location, experience, skills: skillsString, mobile, email, serviceType });

    const service = new Services({
      title,
      company,
      location,
      experience,
      skills: skillsString,
      description,
      salary_range: salaryRange || null,
      service_type: serviceType || 'full-time',
      mobile,
      email,
      resume_filename: resumeFile ? resumeFile.filename : null,
      resume_file_size: resumeFile ? resumeFile.size : null,
      resume_original_name: resumeFile ? resumeFile.originalname : null,
      recruiter_id: req.user.userId
    });

    await service.save();
    console.log('💼 Services insert:', { _id: service._id });

    res.status(201).json({
      message: 'Service created successfully',
      serviceId: service._id
    });
  } catch (error) {
    console.error('Service creation error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service (recruiter only)
router.put('/:id', authenticateToken, [
  body('title').notEmpty().trim(),
  body('company').notEmpty().trim(),
  body('location').notEmpty().trim(),
  body('experience').notEmpty(),
  body('skills').notEmpty(),
  body('description').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can update services' });
    }

    const { id } = req.params;
    const { title, company, location, experience, skills, description, salaryRange, serviceType, status } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;

    // First check if service belongs to this recruiter
    const service = await Services.findById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update your own services' });
    }

    await Services.findByIdAndUpdate(id, {
      title,
      company,
      location,
      experience,
      skills: skillsString,
      description,
      salary_range: salaryRange || null,
      service_type: serviceType || 'full-time',
      status: status || 'active'
    });

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service (recruiter only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Log user and service info for debugging
    console.log('Delete request by user:', req.user);
    const { id } = req.params;
    const service = await Services.findById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    // Check user type
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only freelancers (recruiters) can delete their own services.' });
    }
    // Check service ownership
    if (service.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own services.' });
    }
    await Services.findByIdAndDelete(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get services by recruiter
router.get('/recruiter/my-services', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    const mongoose = require('mongoose');
    const services = await Services.aggregate([
      { $match: { recruiter_id: new mongoose.Types.ObjectId(req.user.userId) } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'service_id',
          as: 'applications'
        }
      },
      {
        $addFields: {
          application_count: { $size: '$applications' }
        }
      },
      { $sort: { created_at: -1 } }
    ]);

    const formattedServices = services.map(service => ({
      ...service,
      skills: service.skills ? service.skills.split(',') : []
    }));

    res.json(formattedServices);
  } catch (error) {
    console.error('Recruiter services error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Download resume file
router.get('/resume/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/resumes', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    // Find the service with this resume filename
    const service = await Services.findOne({ resume_filename: filename });
    if (!service) {
      return res.status(404).json({ error: 'Service not found for this resume' });
    }

    // Check if user has permission to download
    if (req.user.userType === 'recruiter' && service.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${service.resume_original_name || filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send file
    res.download(filePath, service.resume_original_name || filename);
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

module.exports = router;
