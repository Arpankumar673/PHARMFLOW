const express = require('express');
const {
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/suppliers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getSuppliers)
    .post(authorize('PharmacyOwner'), addSupplier);

router
    .route('/:id')
    .put(authorize('PharmacyOwner'), updateSupplier)
    .delete(authorize('PharmacyOwner'), deleteSupplier);

module.exports = router;
