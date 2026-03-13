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
        const { plan, subscriptionActive, subscriptionExpires } = req.user;

        // SuperAdmin bypass
        if (req.user.role === 'SuperAdmin') return next();

        const isExpired = subscriptionExpires && new Date(subscriptionExpires) < new Date();

        if (subscriptionActive && !isExpired && (plan === "PRO" || plan === "ENTERPRISE")) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: isExpired ? "Your subscription has expired. Please renew." : "Upgrade to Pro plan to access this premium feature."
        });
    };
};
