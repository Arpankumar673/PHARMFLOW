const Pharmacy = require('../models/Pharmacy');

// @desc    Get pharmacy details
// @route   GET /api/pharmacy
// @access  Private
exports.getPharmacy = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findById(req.user.pharmacy);
        
        if (!pharmacy) {
            return res.status(404).json({
                success: false,
                error: 'Pharmacy not found'
            });
        }

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

// @desc    Update pharmacy details
// @route   PUT /api/pharmacy
// @access  Private/Owner
exports.updatePharmacy = async (req, res) => {
    try {
        if (req.user.role !== 'PharmacyOwner') {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized access'
            });
        }

        const pharmacy = await Pharmacy.findByIdAndUpdate(req.user.pharmacy, req.body, {
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
