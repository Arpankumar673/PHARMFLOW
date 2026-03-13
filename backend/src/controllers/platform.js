const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Subscription = require('../models/Subscription');
const Sale = require('../models/Sale');

// @desc    Get platform-level analytics for SuperAdmin
// @route   GET /api/platform/analytics
// @access  Private/SuperAdmin
exports.getPlatformAnalytics = async (req, res) => {
    try {
        const totalPharmacies = await Pharmacy.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

        // Calculate monthly revenue from active subscriptions
        const activeSubs = await Subscription.find({ status: 'active' });
        const monthlyRevenue = activeSubs.reduce((acc, sub) => acc + sub.amount, 0);

        // Total medicines across all pharmacies
        const totalMedicines = await Medicine.countDocuments();

        // Pharmacy growth (registrations by month)
        const pharmacyGrowth = await Pharmacy.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Subscription distribution
        const planDistribution = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalPharmacies,
                activeSubscriptions,
                monthlyRevenue,
                totalMedicines,
                pharmacyGrowth,
                planDistribution
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all pharmacies list for SuperAdmin
// @route   GET /api/platform/pharmacies
// @access  Private/SuperAdmin
exports.getPharmacies = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: pharmacies.length,
            data: pharmacies
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get detailed platform revenue metrics
// @route   GET /api/platform/revenue
// @access  Private/SuperAdmin
exports.getRevenueDetails = async (req, res) => {
    try {
        const revenue = await Subscription.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: revenue
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
