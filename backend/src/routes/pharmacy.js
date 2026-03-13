const express = require('express');
const { getPharmacy, updatePharmacy } = require('../controllers/pharmacy');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPharmacy)
    .put(authorize('PharmacyOwner'), updatePharmacy);

module.exports = router;
