const express = require('express');
const router = express.Router();
const { getPriceIntelligence, getExpiryRisks } = require('../controllers/analytics');
const { protect, requirePlan } = require('../middleware/auth');

router.use(protect);

router.get('/price-intelligence', getPriceIntelligence);
router.get('/expiry-risks', getExpiryRisks);

module.exports = router;
