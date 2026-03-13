const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const Pharmacy = require('../models/Pharmacy');

// @desc    Update system preferences
// @route   PUT /api/settings/preferences
// @access  Private/Owner
exports.updatePreferences = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndUpdate(
            req.user.pharmacy, 
            { preferences: req.body }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: pharmacy.preferences
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Export pharmacy snapshot
// @route   GET /api/settings/export-snapshot
// @access  Private/Owner
exports.exportSnapshot = async (req, res) => {
    try {
        const medicines = await Medicine.find({ pharmacy: req.user.pharmacy });
        const sales = await Sale.find({ pharmacy: req.user.pharmacy });

        res.json({
            timestamp: new Date(),
            pharmacyId: req.user.pharmacy,
            inventory: medicines,
            sales: sales
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
