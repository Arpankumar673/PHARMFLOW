const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
        required: true
    },
    medicines: [{
        name: String,
        quantity: Number
    }],
    totalQuantity: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
