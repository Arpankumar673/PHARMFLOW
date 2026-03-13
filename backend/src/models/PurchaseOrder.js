const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    medicines: [{
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine'
        },
        name: String,
        quantity: Number,
        price: Number
    }],
    totalItems: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Ordered', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
