const mongoose = require('mongoose');

const PharmacyNetworkSchema = new mongoose.Schema({
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    location: {
        name: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    medicinesAvailable: [{
        name: String,
        quantity: Number
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PharmacyNetwork', PharmacyNetworkSchema);
