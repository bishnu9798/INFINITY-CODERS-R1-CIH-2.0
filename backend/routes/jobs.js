const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job.js');
const User = require('../models/User.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Get all jobs (public)
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

    const jobs = await Job.find(filter)
      .populate('recruiter_id', 'full_name company_name')
      .sort({ created_at: -1 });

    const formattedJobs = jobs.map(job => ({
      ...job.toObject(),
      recruiter_name: job.recruiter_id?.full_name,
      company_name: job.recruiter_id?.company_name,
      skills: job.skills ? job.skills.split(',') : []
    }));

    res.json(formattedJobs);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('recruiter_id', 'full_name company_name');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const formattedJob = {
      ...job.toObject(),
      recruiter_name: job.recruiter_id?.full_name,
      company_name: job.recruiter_id?.company_name,
      skills: job.skills ? job.skills.split(',') : []
    };

    res.json(formattedJob);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create job (recruiter only)
router.post('/', authenticateToken, [
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
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    const { title, company, location, experience, skills, description, salaryRange, jobType } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;

    const job = new Job({
      title,
      company,
      location,
      experience,
      skills: skillsString,
      description,
      salary_range: salaryRange || null,
      job_type: jobType || 'full-time',
      recruiter_id: req.user.userId
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      jobId: job._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job (recruiter only)
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
      return res.status(403).json({ error: 'Only recruiters can update jobs' });
    }

    const { id } = req.params;
    const { title, company, location, experience, skills, description, salaryRange, jobType, status } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;

    // First check if job belongs to this recruiter
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update your own jobs' });
    }

    await Job.findByIdAndUpdate(id, {
      title,
      company,
      location,
      experience,
      skills: skillsString,
      description,
      salary_range: salaryRange || null,
      job_type: jobType || 'full-time',
      status: status || 'active'
    });

    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job (recruiter only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Log user and job info for debugging
    console.log('Delete request by user:', req.user);
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    // Check user type
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only freelancers (recruiters) can delete their own services.' });
    }
    // Check job ownership
    if (job.recruiter_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own services.' });
    }
    await Job.findByIdAndDelete(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get jobs by recruiter
router.get('/recruiter/my-jobs', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    const mongoose = require('mongoose');
    const jobs = await Job.aggregate([
      { $match: { recruiter_id: new mongoose.Types.ObjectId(req.user.userId) } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job_id',
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

    const formattedJobs = jobs.map(job => ({
      ...job,
      skills: job.skills ? job.skills.split(',') : []
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error('Recruiter jobs error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
