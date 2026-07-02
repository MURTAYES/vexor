const express = require('express');
const { checkout, voidOrder } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/', checkout);
router.post('/:id/void', voidOrder);

module.exports = router;
