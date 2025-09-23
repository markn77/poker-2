// server/routes/tables.js - FIXED VERSION
console.log('🔧 DEBUG: Loading tables.js routes file');

const express = require('express');
const TableController = require('../controllers/tableController');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

console.log('🔧 DEBUG: TableController loaded:', typeof TableController);
console.log('🔧 DEBUG: TableController.getTables:', typeof TableController.getTables);

const router = express.Router();

// Validation middleware
const validateJoinAsPlayer = [
  body('buyInAmount')
    .isNumeric()
    .withMessage('Buy-in amount must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Buy-in amount must be greater than 0');
      }
      return true;
    }),
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

// IMPORTANT: Put specific routes BEFORE parameterized routes
// Get table templates - must come before /:tableId
router.get('/templates/all', TableController.getTableTemplates);

// Get all active tables
router.get('/', TableController.getTables);

// Get specific table details - this should come AFTER specific routes
router.get('/:tableId', TableController.getTable);

// Join table as spectator
router.post('/:tableId/spectate', TableController.joinAsSpectator);

// Join table as player
router.post('/:tableId/join', validateJoinAsPlayer, handleValidationErrors, TableController.joinAsPlayer);

// Leave table
router.post('/:tableId/leave', TableController.leaveTable);

console.log('🔧 DEBUG: Tables router created and routes defined');
module.exports = router;