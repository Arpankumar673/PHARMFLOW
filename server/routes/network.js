const express = require('express');
const router = express.Router();
const { searchNetworkMedicine, syncNetworkStock } = require('../controllers/network');
const { protect, requirePlan } = require('../middleware/auth');

router.use(protect);
router.use(requirePlan('Enterprise'));

router.get('/search-medicine', searchNetworkMedicine);
router.post('/sync', syncNetworkStock);

module.exports = router;
