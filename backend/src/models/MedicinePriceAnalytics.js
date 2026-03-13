const mongoose = require('mongoose');

const MedicinePriceAnalyticsSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true
    },
    averageMarketPrice: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    margin: {
        type: Number
    },
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MedicinePriceAnalytics', MedicinePriceAnalyticsSchema);
