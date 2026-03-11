const { scanPrescription } = require('../services/prescriptionOCR');

// @desc    Scan prescription image and extract medicines
// @route   POST /api/prescription/scan
// @access  Private/Pharmacist, PharmacyOwner
exports.processPrescription = async (req, res) => {
    try {
        // In a real app, req.file would contain the image buffer or path
        const mockImageUrl = "prescriptions/scan_temp.jpg";

        const result = await scanPrescription(mockImageUrl);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to process prescription image"
        });
    }
};
