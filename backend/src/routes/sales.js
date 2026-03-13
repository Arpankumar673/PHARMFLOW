const express = require('express');
const {
    createSale,
    getSales,
    getSale
} = require('../controllers/sales');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(authorize('PharmacyOwner', 'Pharmacist', 'Staff'), createSale);

router.post('/create', authorize('PharmacyOwner', 'Pharmacist', 'Staff'), createSale);

router
    .route('/history')
    .get(authorize('PharmacyOwner', 'Pharmacist', 'Staff'), getSales);

router
    .route('/:id')
    .get(authorize('PharmacyOwner', 'Pharmacist', 'Staff'), getSale);

module.exports = router;
