const Sale = require('../models/Sale');

// @desc    Get recent dashboard activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
exports.getRecentActivity = async (req, res) => {
    try {
        const sales = await Sale.find({ pharmacy: req.user.pharmacy })
            .populate("items.medicine", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        const formattedSales = sales.map(sale => ({
            invoice: sale._id,
            customer: sale.customerName,
            amount: sale.grandTotal,
            medicines: sale.items.map(i =>
                i.medicine?.name || i.name
            ),
            time: sale.createdAt
        }));

        res.json(formattedSales);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
