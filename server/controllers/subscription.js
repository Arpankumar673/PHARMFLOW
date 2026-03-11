const Subscription = require('../models/Subscription');
const Pharmacy = require('../models/Pharmacy');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

// @desc    Create a Razorpay order for subscription
// @route   POST /api/subscription/create-order
// @access  Private/PharmacyOwner
exports.createOrder = async (req, res) => {
    try {
        const { plan } = req.body;

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Plan is required"
            });
        }

        let amount = 0;
        const pricing = {
            Basic: 19900, // 199.00 in paisa
            Pro: 39900,   // 399.00
            Enterprise: 79900 // 799.00
        };

        if (!pricing[plan]) {
            return res.status(400).json({ success: false, error: 'Invalid plan selected' });
        }

        amount = pricing[plan];

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create a pending subscription record linked to pharmacy
        await Subscription.create({
            pharmacyId: req.user.pharmacy,
            razorpayOrderId: order.id,
            plan: plan,
            amount: amount / 100,
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/subscription/verify-payment
// @access  Private/PharmacyOwner
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const subscription = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });

            if (!subscription) {
                return res.status(404).json({ success: false, error: 'Subscription record not found' });
            }

            subscription.status = 'active';
            subscription.paymentStatus = 'paid';
            subscription.razorpayPaymentId = razorpay_payment_id;
            subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
            await subscription.save();

            // Update Pharmacy plan
            await Pharmacy.findByIdAndUpdate(subscription.pharmacyId, {
                subscriptionPlan: subscription.plan,
                status: 'Active'
            });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                error: "Invalid signature"
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get subscription status
// @route   GET /api/subscription/status
// @access  Private/PharmacyOwner
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            pharmacyId: req.user.pharmacy,
            status: 'active'
        }).sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(200).json({
                success: true,
                data: { plan: 'None', status: 'inactive' }
            });
        }

        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private/PharmacyOwner
exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            pharmacyId: req.user.pharmacy,
            status: 'active'
        });

        if (!subscription) {
            return res.status(404).json({ success: false, error: 'No active subscription found' });
        }

        subscription.status = 'cancelled';
        await subscription.save();

        // Optional: Keep plan until period ends, but for simplicity we cancel now
        await Pharmacy.findByIdAndUpdate(req.user.pharmacy, {
            status: 'Suspended'
        });

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get Admin Subscription Analytics
// @route   GET /api/subscription/admin/analytics
// @access  Private/SuperAdmin
exports.getAdminAnalytics = async (req, res) => {
    try {
        const totalPharmacies = await Pharmacy.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

        const subscriptions = await Subscription.find({ status: 'active' });
        const monthlyRevenue = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);

        const planDistribution = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalPharmacies,
                activeSubscriptions,
                monthlyRevenue,
                planDistribution
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/subscription/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEB_SECRET || 'your_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payload = req.body.payload;

    try {
        if (event === 'payment.captured' || event === 'order.paid') {
            const orderId = payload.payment?.entity?.order_id || payload.order?.entity?.id;
            const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
            if (subscription) {
                subscription.status = 'active';
                subscription.paymentStatus = 'paid';
                subscription.razorpayPaymentId = payload.payment?.entity?.id;
                await subscription.save();
                await Pharmacy.findByIdAndUpdate(subscription.pharmacyId, {
                    subscriptionPlan: subscription.plan,
                    status: 'Active'
                });
            }
        } else if (event === 'payment.failed') {
            const orderId = payload.payment?.entity?.order_id;
            const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
            if (subscription) {
                subscription.status = 'failed';
                subscription.paymentStatus = 'failed';
                await subscription.save();
            }
        } else if (event === 'subscription.cancelled') {
            const subId = payload.subscription?.entity?.id;
            const subscription = await Subscription.findOne({ razorpaySubscriptionId: subId });
            if (subscription) {
                subscription.status = 'cancelled';
                await subscription.save();
                await Pharmacy.findByIdAndUpdate(subscription.pharmacyId, { status: 'Suspended' });
            }
        }
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).send('Webhook Processing Error');
    }
};
