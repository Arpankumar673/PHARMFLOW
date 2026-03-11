const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a supplier name'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    email: String,
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

module.exports = mongoose.model('Supplier', supplierSchema);
