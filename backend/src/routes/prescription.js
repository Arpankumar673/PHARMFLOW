const express = require('express');
const router = express.Router();
const { processPrescription } = require('../controllers/prescription');
const { protect, authorize } = require('../middleware/auth');
const { requirePlan } = require('../middleware/auth');

router.use(protect);
router.post('/scan', authorize('Pharmacist', 'PharmacyOwner'), requirePlan('Pro', 'Enterprise'), processPrescription);

module.exports = router;
