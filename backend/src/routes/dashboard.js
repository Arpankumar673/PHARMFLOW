const express = require('express');
const { getRecentActivity } = require('../controllers/dashboard');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/recent-activity', protect, getRecentActivity);

module.exports = router;
