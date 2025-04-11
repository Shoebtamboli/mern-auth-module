const User = require('../models/user.model');
const { AppError } = require('../middlewares/errorMiddleware');
const { generateToken } = require('../utils/jwt.utils');

/**
 * Register a new user with email and password
 * @param {Object} userData - User registration data
 * @returns {Object} - User object and JWT token
 */
exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Create new user (password will be hashed via pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    },
    token,
  };
};

/**
 * Authenticate user with email and password
 * @param {Object} credentials - User login credentials
 * @returns {Object} - User object and JWT token
 */
exports.loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email and explicitly select the password field (which is normally excluded)
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if password matches
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

/**
 * Sanitize user data for response (remove sensitive fields)
 * @param {Object} user - User document from MongoDB
 * @returns {Object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    emailVerified: user.emailVerified,
  };
};

// Export the sanitized user function
exports.sanitizeUser = sanitizeUser;