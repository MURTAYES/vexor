const express = require('express');
const { getProducts, searchProducts, getProductSkus } = require('../controllers/catalogController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all catalog routes
router.use(requireAuth);

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id/skus', getProductSkus);

module.exports = router;
