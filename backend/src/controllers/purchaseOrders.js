const PurchaseOrder = require('../models/PurchaseOrder');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const Supplier = require('../models/Supplier');

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
exports.getPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({ pharmacyId: req.user.pharmacy })
            .populate('supplier', 'name')
            .sort('-createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create a new purchase order
// @route   POST /api/purchase-orders
// @access  Private/PharmacyOwner
exports.createPurchaseOrder = async (req, res) => {
    try {
        const { supplier, medicines, totalAmount, totalItems } = req.body;
        
        const order = await PurchaseOrder.create({
            pharmacyId: req.user.pharmacy,
            supplier,
            medicines,
            totalAmount,
            totalItems,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update purchase order status
// @route   PATCH /api/purchase-orders/:id
// @access  Private
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await PurchaseOrder.findOneAndUpdate(
            { _id: req.params.id, pharmacyId: req.user.pharmacy },
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // If delivered, update stock
        if (status === 'Delivered') {
            for (const item of order.medicines) {
                const query = item.medicineId 
                    ? { _id: item.medicineId, pharmacy: req.user.pharmacy }
                    : { name: item.name, pharmacy: req.user.pharmacy };

                await Medicine.findOneAndUpdate(
                    query,
                    { $inc: { quantity: item.quantity } }
                );
            }
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get low stock medicines
// @route   GET /api/purchase-orders/low-stock
// @access  Private
exports.getLowStock = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            pharmacy: req.user.pharmacy,
            $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        });
        res.status(200).json({ success: true, data: medicines });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get auto refill suggestions (PRO feature)
// @route   GET /api/purchase-orders/suggestions
// @access  Private/Pro+
exports.getRefillSuggestions = async (req, res) => {
    try {
        // Find pharmacy settings
        const pharmacy = await Pharmacy.findById(req.user.pharmacy);
        
        if (!pharmacy.autoRefillEnabled) {
            return res.status(200).json({ success: true, data: [], message: 'Auto refill is disabled' });
        }

        const lowStock = await Medicine.find({
            pharmacy: req.user.pharmacy,
            $expr: { $lte: ["$quantity", pharmacy.autoRefillSettings?.minStockLevel || "$lowStockThreshold"] }
        });

        const suggestions = lowStock.map(med => ({
            medicine: med.name,
            currentStock: med.quantity,
            qty: pharmacy.autoRefillSettings?.defaultQuantity || 50,
            supplier: pharmacy.autoRefillSettings?.preferredSupplier || null,
            _id: med._id
        }));

        res.status(200).json({ success: true, data: suggestions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update auto refill settings
// @route   POST /api/purchase-orders/refill-settings
// @access  Private/Pro+
exports.updateRefillSettings = async (req, res) => {
    try {
        const { enabled, settings } = req.body;
        const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
            req.user.pharmacy,
            { 
                autoRefillEnabled: enabled,
                autoRefillSettings: settings
            },
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedPharmacy });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
