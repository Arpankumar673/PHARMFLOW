const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
exports.getMedicines = async (req, res) => {
    try {
        const query = { pharmacy: req.user.pharmacy };

        // Barcode search support
        if (req.query.barcode) {
            query.barcode = req.query.barcode;
        }

        const medicines = await Medicine.find(query).populate('supplier', 'name');

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Search medicines by name
// @route   GET /api/inventory/search
// @access  Private
exports.searchMedicines = async (req, res) => {
    try {
        const { name, q } = req.query;
        const searchTerm = q || name;
        
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a search term'
            });
        }

        const medicines = await Medicine.find({
            pharmacy: req.user.pharmacy,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { barcode: searchTerm }
            ]
        });

        res.status(200).json({
            success: true,
            data: medicines
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
exports.getMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            pharmacy: req.user.pharmacy
        }).populate('supplier', 'name');

        if (!medicine) {
            return res.status(404).json({
                success: false,
                error: 'Medicine not found'
            });
        }

        res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Add medicine
// @route   POST /api/medicines
// @access  Private/PharmacyOwner/Pharmacist
exports.addMedicine = async (req, res) => {
    try {
        // Add pharmacy to req.body
        req.body.pharmacy = req.user.pharmacy;

        // Duplicate barcode protection
        if (req.body.barcode) {
            const existing = await Medicine.findOne({ barcode: req.body.barcode });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: 'Medicine with this barcode already exists'
                });
            }
        } else if (req.body.barcode === '') {
            req.body.barcode = null;
        }

        const medicine = await Medicine.create(req.body);

        res.status(201).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/PharmacyOwner/Pharmacist
exports.updateMedicine = async (req, res) => {
    try {
        let medicine = await Medicine.findOne({
            _id: req.params.id,
            pharmacy: req.user.pharmacy
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                error: 'Medicine not found'
            });
        }

        // Barcode duplicate protection for update
        if (req.body.barcode && req.body.barcode !== medicine.barcode) {
            const existing = await Medicine.findOne({ barcode: req.body.barcode });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: 'Medicine with this barcode already exists'
                });
            }
        } else if (req.body.barcode === '') {
            req.body.barcode = null;
        }

        // Validate numeric values
        if (req.body.purchasePrice !== undefined) req.body.purchasePrice = Number(req.body.purchasePrice);
        if (req.body.sellingPrice !== undefined) req.body.sellingPrice = Number(req.body.sellingPrice);
        if (req.body.quantity !== undefined) req.body.quantity = Number(req.body.quantity);
        if (req.body.lowStockThreshold !== undefined) req.body.lowStockThreshold = Number(req.body.lowStockThreshold);

        medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/PharmacyOwner
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            pharmacy: req.user.pharmacy
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                error: 'Medicine not found'
            });
        }

        await medicine.deleteOne();

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
