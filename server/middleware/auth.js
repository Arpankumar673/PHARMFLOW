const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "User role not authorized"
            });
        }
        next();
    };
};

// Restrict access based on subscription plan
exports.requirePlan = (...plans) => {
    return (req, res, next) => {
        if (!req.user.pharmacy) {
            return res.status(403).json({
                success: false,
                error: 'Pharmacy context missing'
            });
        }

        // We assume req.user is populated with pharmacy details or we fetch it
        // For simplicity, let's assume req.user.pharmacy is the pharmacy object if populated, 
        // but often it's just the ID. Let's fetch it if needed or assume role check handles some of it.
        // Actually, let's use the Pharmacy model to check the plan.
        const Pharmacy = require('../models/Pharmacy');

        Pharmacy.findById(req.user.pharmacy).then(pharmacy => {
            if (!pharmacy || !plans.includes(pharmacy.subscriptionPlan)) {
                return res.status(403).json({
                    success: false,
                    message: `Upgrade to Pro plan to access this premium feature. Your current ${pharmacy?.subscriptionPlan || 'No'} plan does not support this.`
                });
            }
            next();
        }).catch(err => {
            res.status(500).json({ success: false, error: err.message });
        });
    };
};
