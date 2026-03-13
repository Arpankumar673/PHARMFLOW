const express = require('express');
const router = express.Router();
const { 
    getPurchaseOrders, 
    createPurchaseOrder, 
    updateOrderStatus, 
    getLowStock,
    getRefillSuggestions,
    updateRefillSettings
} = require('../controllers/purchaseOrders');
const { protect, authorize, requirePlan } = require('../middleware/auth');

router.use(protect);

router.get('/', getPurchaseOrders);
router.post('/', createPurchaseOrder);
router.patch('/:id', updateOrderStatus);
router.get('/low-stock', getLowStock);

// Pro features
router.get('/suggestions', requirePlan('Pro', 'Enterprise'), getRefillSuggestions);
router.post('/refill-settings', requirePlan('Pro', 'Enterprise'), updateRefillSettings);

module.exports = router;
