const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
} = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, validate, authController.register);
// POST /api/auth/login - Login user
router.post('/login', loginValidation, validate, authController.login);
// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
// POST /api/auth/reset-password/:resetToken - Reset password using token
router.post('/reset-password/:resetToken', resetPasswordValidation, validate, authController.resetPassword);

// Protected routes
// GET /api/auth/me - Get current authenticated user
router.get('/me', protect, authController.getCurrentUser);
// POST /api/auth/change-password - Change user password
router.post('/change-password', protect, changePasswordValidation, validate, authController.changePassword);

module.exports = router;