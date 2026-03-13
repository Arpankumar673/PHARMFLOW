const express = require('express');
const { getStaff, addStaff, deleteStaff } = require('../controllers/staff');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('PharmacyOwner'));

router.route('/')
    .get(getStaff)
    .post(addStaff);

router.route('/:id')
    .delete(deleteStaff);

module.exports = router;
