const express = require('express');
const {
    getMedicines,
    getMedicine,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines
} = require('../controllers/medicines');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getMedicines)
    .post(authorize('PharmacyOwner', 'Pharmacist'), addMedicine);

router.get('/search', searchMedicines);
router.get('/barcode/:barcode', async (req, res) => {
    try {
        const Medicine = require('../models/Medicine');
        const medicine = await Medicine.findOne({
            pharmacy: req.user.pharmacy,
            barcode: req.params.barcode
        });
        if (!medicine) return res.status(404).json({ success: false, error: 'Entity not found' });
        res.status(200).json({ success: true, data: medicine });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router
    .route('/:id')
    .get(getMedicine)
    .put(authorize('PharmacyOwner', 'Pharmacist'), updateMedicine)
    .delete(authorize('PharmacyOwner'), deleteMedicine);

module.exports = router;
