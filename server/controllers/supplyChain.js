const Distributor = require('../models/Distributor');
const PurchaseOrder = require('../models/PurchaseOrder');
const Medicine = require('../models/Medicine');

// @desc    Get all distributors
// @route   GET /api/supply-chain/distributors
// @access  Private
exports.getDistributors = async (req, res) => {
    try {
        const distributors = await Distributor.find({ pharmacyId: req.user.pharmacy });
        res.status(200).json({ success: true, data: distributors });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create purchase order
// @route   POST /api/supply-chain/orders
// @access  Private/PharmacyOwner
exports.createPurchaseOrder = async (req, res) => {
    try {
        req.body.pharmacyId = req.user.pharmacy;
        const order = await PurchaseOrder.create(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Auto-suggest reorder based on low stock
// @route   GET /api/supply-chain/reorder-suggestions
// @access  Private
exports.getReorderSuggestions = async (req, res) => {
    try {
        const lowStockMedicines = await Medicine.find({
            pharmacy: req.user.pharmacy,
            $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        });

        const suggestions = await Promise.all(lowStockMedicines.map(async (med) => {
            const distributor = await Distributor.findOne({
                pharmacyId: req.user.pharmacy,
                medicinesSupplied: med.name
            });
            return {
                medicine: med.name,
                currentStock: med.quantity,
                threshold: med.lowStockThreshold,
                suggestedDistributor: distributor ? distributor.name : 'No linked distributor',
                distributorId: distributor ? distributor._id : null
            };
        }));

        res.status(200).json({ success: true, data: suggestions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
