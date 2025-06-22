const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register (temporary mock implementation)
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('userType').isIn(['jobseeker', 'recruiter']).withMessage('User type must be either jobseeker or recruiter'),
  body('fullName').notEmpty().trim().withMessage('Full name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Registration validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType, fullName, companyName } = req.body;
    console.log('Registration attempt for:', email, userType);

    // Mock registration for testing
    const token = jwt.sign(
      { userId: Date.now().toString(), userType: userType, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: Date.now().toString(),
        email: email,
        userType: userType,
        fullName: fullName,
        companyName: companyName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login (temporary mock implementation)
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Mock authentication for testing
    if (email === 'manishmodi0408@gmail.com' && password === '987654') {
      const token = jwt.sign(
        { userId: '1', userType: 'recruiter', email: email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: '1',
          email: email,
          userType: 'recruiter',
          fullName: 'Manish Modi',
          companyName: 'The Tech World'
        }
      });
    } else if (email === 'manish1@gmail.com' && password === '123456') {
      const token = jwt.sign(
        { userId: '2', userType: 'jobseeker', email: email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: '2',
          email: email,
          userType: 'jobseeker',
          fullName: 'Manish Kumar'
        }
      });
    } else {
      console.log('Invalid credentials for:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
