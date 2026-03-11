const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const jwt = require('jsonwebtoken');

// @desc    Register a new Pharmacy (SaaS Onboarding)
// @route   POST /api/auth/register-pharmacy
// @access  Public
exports.registerPharmacy = async (req, res) => {
    try {
        const {
            name,
            ownerName,
            email,
            phone,
            address,
            password,
            subscriptionPlan
        } = req.body;

        // 1. Create Pharmacy (Tenant)
        const pharmacy = await Pharmacy.create({
            name,
            ownerName,
            email,
            phone,
            address,
            subscriptionPlan: subscriptionPlan || 'Basic'
        });

        // 2. Create Owner User linked to this pharmacy
        const user = await User.create({
            name: ownerName,
            email,
            password,
            role: 'PharmacyOwner',
            pharmacy: pharmacy._id
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Register staff/pharmacist (by Owner)
// @route   POST /api/auth/register-staff
// @access  Private/PharmacyOwner
exports.registerStaff = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure role is valid
        if (!['Pharmacist', 'Staff'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role for staff registration'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            pharmacy: req.user.pharmacy
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password').populate('pharmacy');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('pharmacy');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update pharmacy details
// @route   PUT /api/auth/pharmacy
// @access  Private/Owner
exports.updatePharmacy = async (req, res) => {
    try {
        if (req.user.role !== 'PharmacyOwner') {
            return res.status(403).json({
                success: false,
                error: 'Only pharmacy owners can update pharmacy details'
            });
        }

        const fieldsToUpdate = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone
        };

        const pharmacy = await Pharmacy.findByIdAndUpdate(req.user.pharmacy, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: pharmacy
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'Password is incorrect'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            pharmacy: user.pharmacy
        }
    });
};
