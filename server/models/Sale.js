const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerName: {
        type: String,
        default: 'Walking Customer'
    },
    items: [{
        medicine: {
            type: mongoose.Schema.ObjectId,
            ref: 'Medicine',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'UPI'],
        default: 'Cash'
    },
    soldBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
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

module.exports = mongoose.model('Sale', saleSchema);
