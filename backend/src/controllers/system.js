const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const fs = require('fs');
const path = require('path');

// @desc    Export/Backup pharmacy data
// @route   POST /api/system/backup
// @access  Private/Owner
exports.backupSystem = async (req, res) => {
    try {
        const medicines = await Medicine.find({ pharmacy: req.user.pharmacy });
        const sales = await Sale.find({ pharmacy: req.user.pharmacy });
        
        const backupData = {
            timestamp: new Date().toISOString(),
            pharmacyId: req.user.pharmacy,
            inventory: medicines,
            sales: sales
        };

        // For demo: return as JSON, in production this would save to a file or cloud storage
        res.status(200).json({
            success: true,
            message: 'Backup generated successfully',
            data: backupData
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Reset system cache (demo)
// @route   POST /api/system/reset-cache
// @access  Private/Owner
exports.resetCache = async (req, res) => {
    try {
        // Placeholder for cache reset logic
        res.status(200).json({
            success: true,
            message: 'System cache purged successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
