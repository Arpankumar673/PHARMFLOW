const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// @desc    Get dashboard metrics
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacy;

        const totalMedicines = await Medicine.countDocuments({ pharmacy: pharmacyId });
        const lowStock = await Medicine.find({
            pharmacy: pharmacyId,
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailySales = await Sale.find({
            pharmacy: pharmacyId,
            createdAt: { $gte: today }
        });

        const revenueToday = dailySales.reduce((acc, sale) => acc + sale.grandTotal, 0);

        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const monthlySales = await Sale.find({
            pharmacy: pharmacyId,
            createdAt: { $gte: currentMonth }
        });

        const monthlyRevenue = monthlySales.reduce((acc, sale) => acc + sale.grandTotal, 0);

        const expiringSoon = await Medicine.find({
            pharmacy: pharmacyId,
            expiryDate: {
                $lte: new Date(new Date().setMonth(new Date().getMonth() + 3)) // Next 3 months
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalMedicines,
                lowStockCount: lowStock.length,
                revenueToday,
                monthlyRevenue,
                expiringSoonCount: expiringSoon.length,
                lowStockMedicines: lowStock,
                expiringSoonMedicines: expiringSoon
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get daily sales report
// @route   GET /api/reports/daily
// @access  Private
exports.getDailyReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sales = await Sale.find({
            pharmacy: req.user.pharmacy,
            createdAt: { $gte: today }
        }).populate('soldBy', 'name');

        res.status(200).json({
            success: true,
            data: sales
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get top selling medicines
// @route   GET /api/reports/top-medicines
// @access  Private
exports.getTopSelling = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacy;

        // Aggregate sales to find top medicines
        const topMedicines = await Sale.aggregate([
            { $match: { pharmacy: pharmacyId } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.medicine',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: topMedicines
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    AI Medicine Demand Prediction
// @route   GET /api/reports/demand-prediction
// @access  Private (Pro/Enterprise Only)
exports.getPredictedDemand = async (req, res) => {
    try {
        const pharmacyId = req.user.pharmacy;

        // Implementation of Time-Series Forecasting (Simulated for Demo)
        // In production, this would trigger a TensorFlow.js model or call a Python microservice

        const topMedicines = await Sale.aggregate([
            { $match: { pharmacy: pharmacyId } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.medicine',
                    name: { $first: '$items.name' },
                    history: { $push: { quantity: '$items.quantity', date: '$createdAt' } },
                    totalSold: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        const predictions = topMedicines.map(med => {
            // Simple logic: Predict 20% more than average weekly sales
            const avgSold = med.totalSold / 4; // Assume 4 weeks of data for simulation
            const predicted = Math.ceil(avgSold * 1.25);

            return {
                medicineId: med._id,
                name: med.name,
                predictedQuantityNextWeek: predicted,
                confidenceScore: 0.85 + (Math.random() * 0.1),
                recommendation: predicted > 50 ? 'High Demand' : 'Normal Stocking'
            };
        });

        res.status(200).json({
            success: true,
            data: predictions
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
