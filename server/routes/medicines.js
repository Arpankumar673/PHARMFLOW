const express = require('express');
const {
    getMedicines,
    getMedicine,
    addMedicine,
    updateMedicine,
    deleteMedicine
} = require('../controllers/medicines');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getMedicines)
    .post(authorize('PharmacyOwner', 'Pharmacist'), addMedicine);

router
    .route('/:id')
    .get(getMedicine)
    .put(authorize('PharmacyOwner', 'Pharmacist'), updateMedicine)
    .delete(authorize('PharmacyOwner'), deleteMedicine);

module.exports = router;
