const jwt = require('jsonwebtoken');
const { AppError } = require('./errorMiddleware');
const User = require('../models/user.model');
const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware to protect routes - verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Find user by id from token
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
    };
    
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};

/**
 * Middleware to restrict routes to specific user roles
 * @param  {...String} roles - Roles allowed to access the route
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to perform this action', 403));
    }
    next();
  };
};