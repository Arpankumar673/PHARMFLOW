const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: function () {
            return this.provider !== 'google';
        },
        minlength: 6,
        select: false
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['SuperAdmin', 'PharmacyOwner', 'Pharmacist', 'Staff', 'Cashier'],
        default: 'Staff'
    },
    pharmacy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pharmacy',
        required: function () { 
            return this.role !== 'SuperAdmin' && this.provider !== 'google'; 
        }
    },
    usedPromoCode: {
        type: String,
        default: null
    },
    plan: {
        type: String,
        enum: ['BASIC', 'PRO', 'ENTERPRISE'],
        default: 'BASIC'
    },
    subscriptionActive: {
        type: Boolean,
        default: false
    },
    subscriptionExpires: {
        type: Date,
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
