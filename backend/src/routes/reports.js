const express = require('express');
const {
    getDashboardStats,
    getDailyReport,
    getTopSelling,
    getPredictedDemand,
    getSalesReport,
    getInventoryHealth,
    getSupplierAudit,
    getProfitAnalysis,
    getDemandForecast,
    getTodayInsights
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

// Advanced Pharmacy Analytics (V2)
router.get('/sales', authorize('PharmacyOwner', 'Pharmacist'), getSalesReport);
router.get('/inventory-health', authorize('PharmacyOwner', 'Pharmacist'), getInventoryHealth);
router.get('/supplier-audit', authorize('PharmacyOwner'), getSupplierAudit);
router.get('/profit', authorize('PharmacyOwner'), getProfitAnalysis);
router.get('/demand-forecast', authorize('PharmacyOwner'), requirePlan('Pro', 'Enterprise'), getDemandForecast);
router.get('/today-insights', authorize('PharmacyOwner', 'Pharmacist'), getTodayInsights);

module.exports = router;
