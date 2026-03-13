const express = require('express');
const router = express.Router();
const { getDistributors, createPurchaseOrder, getReorderSuggestions } = require('../controllers/supplyChain');
const { protect, authorize, requirePlan } = require('../middleware/auth');

router.use(protect);
router.use(requirePlan('Enterprise'));

router.get('/distributors', getDistributors);
router.post('/orders', authorize('PharmacyOwner'), createPurchaseOrder);
router.get('/reorder-suggestions', getReorderSuggestions);

module.exports = router;
