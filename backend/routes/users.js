const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js');
const Services = require('../models/Services.js');
const Application = require('../models/Application.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('fullName').optional().trim(),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('bio').optional().trim(),
  body('skills').optional().trim(),
  body('experience').optional().trim(),
  body('education').optional().trim(),
  body('companyName').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phone, location, bio, skills, experience, education, companyName } = req.body;

    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (experience) updateData.experience = experience;
    if (education) updateData.education = education;
    if (companyName) updateData.company_name = companyName;

    await User.findByIdAndUpdate(req.user.userId, updateData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics (for dashboard)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType === 'jobseeker') {
      // Get job seeker statistics using MongoDB aggregation
      const mongoose = require('mongoose');

      const applicationStats = await Application.aggregate([
        { $match: { jobseeker_id: new mongoose.Types.ObjectId(req.user.userId) } },
        {
          $group: {
            _id: null,
            total_applications: { $sum: 1 },
            pending_applications: { $sum: { $cond: [{ $eq: ['$status', 'applied'] }, 1, 0] } },
            shortlisted_applications: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
            rejected_applications: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
            hired_applications: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
          }
        }
      ]);

      const totalActiveServices = await Services.countDocuments({ status: 'active' });

      const stats = applicationStats[0] || {
        total_applications: 0,
        pending_applications: 0,
        shortlisted_applications: 0,
        rejected_applications: 0,
        hired_applications: 0
      };

      res.json({
        ...stats,
        total_active_services: totalActiveServices
      });

    } else if (req.user.userType === 'recruiter') {
      // Get recruiter statistics using MongoDB aggregation
      const mongoose = require('mongoose');

      const serviceStats = await Services.aggregate([
        { $match: { recruiter_id: new mongoose.Types.ObjectId(req.user.userId) } },
        {
          $group: {
            _id: null,
            total_services_posted: { $sum: 1 },
            active_services: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            closed_services: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
          }
        }
      ]);

      const applicationCount = await Application.aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },
        { $match: { 'service.recruiter_id': new mongoose.Types.ObjectId(req.user.userId) } },
        { $count: 'total_applications_received' }
      ]);

      const statusBreakdown = await Application.aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },
        { $match: { 'service.recruiter_id': new mongoose.Types.ObjectId(req.user.userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const stats = serviceStats[0] || {
        total_services_posted: 0,
        active_services: 0,
        closed_services: 0
      };

      const statusBreakdownObj = {};
      statusBreakdown.forEach(stat => {
        statusBreakdownObj[stat._id] = stat.count;
      });

      res.json({
        ...stats,
        total_applications_received: applicationCount[0]?.total_applications_received || 0,
        application_status_breakdown: statusBreakdownObj
      });

    } else {
      res.status(403).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
