const User = require('../models/User');

// @desc    Get all staff for a pharmacy
// @route   GET /api/staff
// @access  Private/Owner
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.find({ 
            pharmacy: req.user.pharmacy,
            role: { $in: ['Pharmacist', 'Staff', 'Cashier'] } // Cashier added to roles in thought
        });

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Add staff member
// @route   POST /api/staff
// @access  Private/Owner
exports.addStaff = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Staff',
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

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Owner
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await User.findOne({
            _id: req.params.id,
            pharmacy: req.user.pharmacy
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                error: 'Staff member not found'
            });
        }

        await staff.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
