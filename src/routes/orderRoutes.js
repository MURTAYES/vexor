const express = require('express');
const { checkout, getOrders, getOrderPdf, resendEmail, voidOrder } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getOrders);
router.post('/', checkout);
router.get('/:id/pdf', getOrderPdf);
router.post('/:id/resend-email', resendEmail);
router.post('/:id/void', voidOrder);

module.exports = router;
