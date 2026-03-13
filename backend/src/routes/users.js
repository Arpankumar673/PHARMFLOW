const express = require('express');
const { updateUserProfile, updatePassword, deleteAccount } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', updateUserProfile);
router.put('/change-password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
