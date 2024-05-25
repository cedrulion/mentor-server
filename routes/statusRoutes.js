const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Get status
router.get('/', statusController.getStatus);

// Enable status
router.post('/enable', statusController.enableStatus);

// Disable status
router.post('/disable', statusController.disableStatus);

module.exports = router;
