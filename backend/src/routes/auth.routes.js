const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidation } = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, validate, authController.register);

// Protected routes
// GET /api/auth/me - Get current authenticated user
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;