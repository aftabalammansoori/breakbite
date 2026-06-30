// middleware/authMiddleware.js — JWT verification + role check

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── PROTECT: verify JWT + attach user to req ──────────────
export const protect = async (req, res, next) => {
  let token;

  // Token is sent as: "Authorization: Bearer eyJhbGc..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify signature using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password, thanks to select: false)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalid or expired',
    });
  }
};

// ─── ADMIN ONLY: check role after protect ──────────────────
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }
};