const MedicinePriceAnalytics = require('../models/MedicinePriceAnalytics');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const { predictExpiryRisk } = require('../services/expiryPrediction');

// @desc    Get medicine price intelligence
// @route   GET /api/analytics/price-intelligence
// @access  Private
exports.getPriceIntelligence = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacy;
        const plan = req.user.plan ? req.user.plan.toUpperCase() : 'BASIC';
        
        let analytics = await MedicinePriceAnalytics.find({ pharmacyId: pharmacyId });

        // Transform to the requested format
        const formattedData = analytics.map(item => ({
            name: item.medicineName,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            margin: item.margin,
            marketAverage: item.averageMarketPrice,
            recommendedPrice: Math.round(item.averageMarketPrice * 0.98) // Simple logic for demo
        }));

        if (plan === 'BASIC') {
            // Limit to 5 for Basic
            return res.status(200).json({ 
                success: true, 
                data: {
                    medicines: formattedData.slice(0, 5),
                    isLimited: true
                } 
            });
        }

        // Full data for Pro/Enterprise
        const marketAverageTotal = formattedData.reduce((acc, item) => acc + item.marketAverage, 0);
        const avgMarketPrice = formattedData.length > 0 ? marketAverageTotal / formattedData.length : 0;

        res.status(200).json({ 
            success: true, 
            data: {
                medicines: formattedData,
                recommendedPrice: Math.round(avgMarketPrice * 0.95),
                marketAverage: Math.round(avgMarketPrice)
            } 
        });
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
