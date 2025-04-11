const User = require('../models/user.model');
const { AppError } = require('../middlewares/errorMiddleware');
const { generateToken } = require('../utils/jwt.utils');
const { sendEmail } = require('../utils/email.utils');
const crypto = require('crypto');

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

/**
 * Generate a reset token and send password reset email
 * @param {String} email - User's email
 * @param {String} protocol - HTTP protocol (http or https)
 * @param {String} host - Host domain
 * @returns {Object} - Result of email send operation
 */
exports.forgotPassword = async (email, protocol, host) => {
  // Find user by email
  const user = await User.findOne({ email });
  
  // Always return success even if user not found (security best practice)
  if (!user) {
    return { success: true, message: 'Email sent if account exists' };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and store it in the database
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Token expires in 10 minutes
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;

  // Email content
  const message = `
    <h1>Password Reset</h1>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please go to: ${resetUrl}`,
      html: message,
    });

    return { success: true };
  } catch (error) {
    // If email fails, reset the token fields and throw error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new AppError('Email could not be sent', 500);
  }
};

/**
 * Reset user password with token
 * @param {String} resetToken - Password reset token
 * @param {String} newPassword - New password
 * @returns {Object} - Result of password reset operation
 */
exports.resetPassword = async (resetToken, newPassword) => {
  // Hash the token for comparison with the stored hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user by token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }

  // Set new password (will be hashed by pre-save hook)
  user.password = newPassword;
  
  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  // Save updated user
  await user.save();

  return { success: true };
};

/**
 * Change user's password
 * @param {String} userId - User ID
 * @param {String} currentPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Object} - Success message
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  // Find user by ID and include password field
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordMatch = await user.matchPassword(currentPassword);
  if (!isPasswordMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Set new password (will be hashed via pre-save hook)
  user.password = newPassword;
  
  // Save updated user
  await user.save();

  return { 
    success: true,
    message: 'Password updated successfully' 
  };
};