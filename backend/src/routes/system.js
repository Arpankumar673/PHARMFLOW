const express = require('express');
const { backupSystem, resetCache } = require('../controllers/system');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('PharmacyOwner'));

router.post('/backup', backupSystem);
router.post('/reset-cache', resetCache);

module.exports = router;
