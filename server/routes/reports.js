const express = require('express');
const {
    getDashboardStats,
    getDailyReport,
    getTopSelling,
    getPredictedDemand
} = require('../controllers/reports');
const { protect, authorize, requirePlan } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', authorize('PharmacyOwner', 'Pharmacist'), getDashboardStats);
router.get('/daily', authorize('PharmacyOwner', 'Pharmacist'), getDailyReport);
router.get('/top-medicines',
    authorize('PharmacyOwner', 'Pharmacist'),
    requirePlan('Pro', 'Enterprise'),
    getTopSelling
);
router.get('/demand-prediction',
    authorize('PharmacyOwner', 'Pharmacist'),
    requirePlan('Pro', 'Enterprise'),
    getPredictedDemand
);

module.exports = router;
