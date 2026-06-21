// controllers/authController.js — handles signup and login logic

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ─── HELPER: generate a JWT token ──────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },               // payload (what's stored in the token)
    process.env.JWT_SECRET,       // secret key (from .env)
    { expiresIn: '7d' }           // token valid for 7 days
  );
};

// ─── SIGNUP CONTROLLER ─────────────────────────────────────
// @desc   Register a new user
// @route  POST /api/auth/signup
// @access Public
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // 3. Create new user (password gets hashed automatically by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Send response (no password in response)
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ─── LOGIN CONTROLLER ──────────────────────────────────────
// @desc   Authenticate a user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // 2. Find user (include password since we'll need to verify it)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // 3. Check password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};