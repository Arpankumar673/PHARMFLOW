const express = require('express');
const { updatePreferences, exportSnapshot } = require('../controllers/settings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('PharmacyOwner'));

router.put('/preferences', updatePreferences);
router.get('/export-snapshot', exportSnapshot);

module.exports = router;
