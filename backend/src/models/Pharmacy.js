const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a pharmacy name'],
        trim: true
    },
    ownerName: {
        type: String,
        required: [true, 'Please add owner name']
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    licenseNumber: {
        type: String,
        default: ''
    },
    gstNumber: {
        type: String,
        default: ''
    },
    subscriptionPlan: {
        type: String,
        enum: ['Basic', 'Pro', 'Enterprise'],
        default: 'Basic'
    },
    subscriptionStatus: {
        type: String,
        enum: ['Active', 'Expired', 'Trial'],
        default: 'Trial'
    },
    // System Preferences
    preferences: {
        currency: { type: String, default: '₹' },
        timezone: { type: String, default: 'UTC' },
        lowStockThreshold: { type: Number, default: 10 },
        expiryAlertDays: { type: Number, default: 30 },
        discountPercentage: { type: Number, default: 0 }
    },
    autoRefillEnabled: {
        type: Boolean,
        default: false
    },
    autoRefillSettings: {
        minStockLevel: { type: Number, default: 10 },
        preferredSupplier: { type: mongoose.Schema.ObjectId, ref: 'Supplier' },
        defaultQuantity: { type: Number, default: 50 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
