const express = require('express');
const {
    getPlatformAnalytics,
    getPharmacies,
    getRevenueDetails
} = require('../controllers/platform');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('SuperAdmin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/pharmacies', getPharmacies);
router.get('/revenue', getRevenueDetails);

module.exports = router;
