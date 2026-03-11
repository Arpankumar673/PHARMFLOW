const MedicinePriceAnalytics = require('../models/MedicinePriceAnalytics');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const { predictExpiryRisk } = require('../services/expiryPrediction');

// @desc    Get medicine price intelligence
// @route   GET /api/analytics/price-intelligence
// @access  Private/Pro, Enterprise
exports.getPriceIntelligence = async (req, res) => {
    try {
        const analytics = await MedicinePriceAnalytics.find({ pharmacyId: req.user.pharmacy });
        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get expiry risk alerts for dashboard
// @route   GET /api/analytics/expiry-risks
// @access  Private
exports.getExpiryRisks = async (req, res) => {
    try {
        const medicines = await Medicine.find({ pharmacy: req.user.pharmacy });

        const risks = await Promise.all(medicines.map(async (med) => {
            const salesHistory = await Sale.find({
                'items.medicine': med._id
            }).limit(20);

            const prediction = predictExpiryRisk(med.quantity, salesHistory, med.expiryDate);

            return {
                medicineName: med.name,
                stock: med.quantity,
                expiryDate: med.expiryDate,
                ...prediction
            };
        }));

        // Filter for medium/high risk only
        const filteredRisks = risks.filter(r => r.riskLevel !== 'Low');

        res.status(200).json({
            success: true,
            data: filteredRisks
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
