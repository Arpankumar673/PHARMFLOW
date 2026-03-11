const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// @desc    Create a new sale (Bill)
// @route   POST /api/billing
// @access  Private
exports.createSale = async (req, res) => {
    try {
        const { items, customerName, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please add items to bill'
            });
        }

        let totalAmount = 0;
        const processedItems = [];
        const pharmacyId = req.user.pharmacy;

        // Validate items and check stock
        for (const item of items) {
            // Ensure medicine belongs to this pharmacy
            const medicine = await Medicine.findOne({ _id: item.id, pharmacy: pharmacyId });

            if (!medicine) {
                return res.status(404).json({
                    success: false,
                    error: `Medicine ${item.id} not found in your pharmacy`
                });
            }

            if (medicine.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}`
                });
            }

            const itemPrice = medicine.sellingPrice * item.quantity;
            totalAmount += itemPrice;

            processedItems.push({
                medicine: medicine._id,
                name: medicine.name,
                quantity: item.quantity,
                price: medicine.sellingPrice
            });

            // Update medicine stock
            medicine.quantity -= item.quantity;
            await medicine.save();
        }

        const tax = totalAmount * 0.05; // 5% flat tax for example
        const grandTotal = totalAmount + tax;

        const sale = await Sale.create({
            customerName,
            items: processedItems,
            totalAmount,
            tax,
            grandTotal,
            paymentMethod,
            soldBy: req.user.id,
            pharmacy: pharmacyId
        });

        res.status(201).json({
            success: true,
            data: sale
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all sales (History)
// @route   GET /api/billing/history
// @access  Private
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find({ pharmacy: req.user.pharmacy }).populate('soldBy', 'name').sort('-createdAt');

        res.status(200).json({
            success: true,
            count: sales.length,
            data: sales
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get single sale details
// @route   GET /api/billing/:id
// @access  Private
exports.getSale = async (req, res) => {
    try {
        const sale = await Sale.findOne({
            _id: req.params.id,
            pharmacy: req.user.pharmacy
        }).populate('soldBy', 'name');

        if (!sale) {
            return res.status(404).json({
                success: false,
                error: 'Sale records not found'
            });
        }

        res.status(200).json({
            success: true,
            data: sale
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
