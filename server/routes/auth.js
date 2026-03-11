const express = require('express');
const {
    registerPharmacy,
    registerStaff,
    login,
    getMe,
    updateDetails,
    updatePassword,
    updatePharmacy
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register-pharmacy', registerPharmacy);
router.post('/register-staff', protect, authorize('PharmacyOwner'), registerStaff);
router.post('/login', login);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/pharmacy', protect, authorize('PharmacyOwner'), updatePharmacy);

module.exports = router;
