const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    razorpayCustomerId: {
        type: String
    },
    razorpaySubscriptionId: {
        type: String
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    plan: {
        type: String,
        enum: ['Basic', 'Pro', 'Enterprise'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'pending', 'failed'],
        default: 'pending'
    },
    currentPeriodEnd: {
        type: Date
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'failed'],
        default: 'unpaid'
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
