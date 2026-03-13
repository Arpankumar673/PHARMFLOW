const PharmacyNetwork = require('../models/PharmacyNetwork');
const Pharmacy = require('../models/Pharmacy');

// @desc    Search medicine availability across pharmacy network
// @route   GET /api/network/search-medicine
// @access  Private/Enterprise
exports.searchNetworkMedicine = async (req, res) => {
    try {
        const { medicineName } = req.query;
        if (!medicineName) {
            return res.status(400).json({ success: false, message: "Medicine name is required" });
        }

        const matches = await PharmacyNetwork.find({
            "medicinesAvailable.name": { $regex: medicineName, $options: 'i' },
            "medicinesAvailable.quantity": { $gt: 0 }
        }).populate('pharmacyId', 'name address phone');

        const results = matches.map(match => {
            const medInfo = match.medicinesAvailable.find(m =>
                m.name.toLowerCase().includes(medicineName.toLowerCase())
            );
            return {
                pharmacyName: match.pharmacyId.name,
                address: match.pharmacyId.address,
                phone: match.pharmacyId.phone,
                availableQuantity: medInfo.quantity
            };
        });

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update pharmacy network availability (Sync)
// @route   POST /api/network/sync
// @access  Private
exports.syncNetworkStock = async (req, res) => {
    try {
        const { medicinesAvailable, location } = req.body;

        const networkNode = await PharmacyNetwork.findOneAndUpdate(
            { pharmacyId: req.user.pharmacy },
            {
                medicinesAvailable,
                location,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, data: networkNode });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
