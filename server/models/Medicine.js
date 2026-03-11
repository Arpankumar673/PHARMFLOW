const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a medicine name'],
        trim: true
    },
    batchNumber: {
        type: String,
        required: [true, 'Please add a batch number']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please add an expiry date']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    purchasePrice: {
        type: Number,
        required: [true, 'Please add purchase price']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Please add selling price']
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier',
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true
    },
    pharmacy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Medicine', medicineSchema);
