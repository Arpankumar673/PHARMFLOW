const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    freePlan: {
        type: Boolean,
        default: false
    },
    durationMonths: {
        type: Number,
        required: true
    },
    maxUses: {
        type: Number,
        required: true
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
