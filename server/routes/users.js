
const express = require('express');
const UserController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');

// Import auth middleware
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware for profile updates
const validateProfileUpdate = [
  body('username').optional().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').optional().isEmail().normalizeEmail(),
  body('avatar_url').optional().isURL(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }
  next();
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get current user profile with statistics
router.get('/profile', UserController.getProfile);

// Update user profile
router.put('/profile', validateProfileUpdate, handleValidationErrors, UserController.updateProfile);

// Get user's recent games
router.get('/recent-games', UserController.getRecentGames);

module.exports = router;