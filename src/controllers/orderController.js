const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const SKU = require('../models/SKU');
const { clearCacheKeys } = require('./catalogController');
const { generateInvoicePDF } = require('../services/pdfService');
const { sendInvoiceEmail } = require('../services/emailService');
const logger = require('../utils/logger');
const { z } = require('zod');

const checkoutSchema = z.object({
  customer_name: z.string().min(1),
  customer_phone: z.string().min(1),
  customer_email: z.string().email().optional().or(z.literal('')),
  line_items: z.array(z.object({
    sku_id: z.string().min(1),
    quantity: z.number().int().min(1),
    special_instruction: z.string().max(300).optional(),
  })).min(1),
});

const checkout = async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const { customer_name, customer_phone, customer_email, line_items } = parsed.data;

  // Start Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let subtotal = 0;
    const finalLineItems = [];

    // Process each line item
    for (const item of line_items) {
      // Find the SKU in the database
      const sku = await SKU.findOne({ sku_id: item.sku_id }).session(session);
      if (!sku) {
        throw new Error(`SKU not found: ${item.sku_id}`);
      }

      // Fetch the associated Product to get the real base_price (server-side pricing ORD-02)
      const product = await Product.findById(sku.product_id).session(session);
      if (!product) {
        throw new Error(`Product not found for SKU: ${item.sku_id}`);
      }

      // Decrement stock using optimistic checking (ORD-01, ORD-03)
      const updateResult = await SKU.updateOne(
        { _id: sku._id, stock_available: { $gte: item.quantity } },
        { $inc: { stock_available: -item.quantity } },
        { session }
      );

      if (updateResult.modifiedCount === 0) {
        // Fetch current stock to return helpful 409 error
        const currentSku = await SKU.findById(sku._id);
        const error = new Error('Insufficient stock');
        error.isConflict = true;
        error.skuDetails = {
          sku_id: sku.sku_id,
          size: sku.size,
          remaining_stock: currentSku ? currentSku.stock_available : 0,
        };
        throw error;
      }

      const snapshot_price = product.base_price;
      subtotal += snapshot_price * item.quantity;

      finalLineItems.push({
        product_id: product._id,
        sku_id: sku._id,
        product_name: product.club_country_name,
        size: sku.size,
        quantity: item.quantity,
        snapshot_price,
        special_instruction: item.special_instruction,
      });
    }

    const total = subtotal; // If there were taxes/shipping, compute here

    const order = new Order({
      line_items: finalLineItems,
      subtotal,
      total,
      customer_name,
      customer_phone,
      customer_email,
      status: 'confirmed',
    });

    await order.save({ session });
    await session.commitTransaction();

    // Clear cache since stock was decremented
    await clearCacheKeys('catalog:*');

    // Generate PDF (ORD-05)
    const pdfBuffer = await generateInvoicePDF(order);

    // Fire-and-forget email dispatch (ORD-07) — never blocks the response
    if (customer_email) {
      sendInvoiceEmail(order, pdfBuffer).catch((err) => {
        logger.error({ err, invoice: order.invoice_number }, 'Fire-and-forget email error (should not reach here)');
      });
    }

    // Return PDF as response (ORD-06)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="vexor-invoice-${order.invoice_number}.pdf"`,
      'X-Invoice-Number': order.invoice_number,
      'X-Order-Id': order._id.toString(),
      'Access-Control-Expose-Headers': 'X-Invoice-Number, X-Order-Id, Content-Disposition',
    });
    res.status(201).end(pdfBuffer);
  } catch (error) {
    await session.abortTransaction();
    if (error.isConflict) {
      return res.status(409).json({ 
        error: 'Stock conflict', 
        details: error.skuDetails 
      });
    }
    logger.error({ err: error }, 'Error processing checkout transaction');
    res.status(500).json({ error: error.message || 'Internal server error during checkout' });
  } finally {
    session.endSession();
  }
};

const getOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments();

    res.json({ orders, total, page, limit });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching orders');
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderPdf = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const pdfBuffer = await generateInvoicePDF(order);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="vexor-invoice-${order.invoice_number}.pdf"`,
    });
    res.end(pdfBuffer);
  } catch (error) {
    logger.error({ err: error }, 'Error generating PDF');
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

const resendEmail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.customer_email) {
      return res.status(400).json({ error: 'No customer email on this order' });
    }

    const pdfBuffer = await generateInvoicePDF(order);
    await sendInvoiceEmail(order, pdfBuffer);

    // Reload to get the updated email_sent_at / email_error
    const updatedOrder = await Order.findById(req.params.id).lean();

    res.json({
      message: updatedOrder.email_sent_at ? 'Email sent successfully' : 'Email dispatch attempted',
      email_sent_at: updatedOrder.email_sent_at,
      email_error: updatedOrder.email_error,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error resending email');
    res.status(500).json({ error: 'Failed to resend email' });
  }
};

const voidOrder = async (req, res) => {
  const orderId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'voided') {
      throw new Error('Order is already voided');
    }

    // Restore stock for all line items (ORD-09)
    for (const item of order.line_items) {
      await SKU.updateOne(
        { _id: item.sku_id },
        { $inc: { stock_available: item.quantity } },
        { session }
      );
    }

    order.status = 'voided';
    await order.save({ session });

    await session.commitTransaction();
    await clearCacheKeys('catalog:*');

    res.status(200).json({ message: 'Order voided and stock restored successfully' });
  } catch (error) {
    await session.abortTransaction();
    logger.error({ err: error }, 'Error voiding order');
    res.status(400).json({ error: error.message || 'Error voiding order' });
  } finally {
    session.endSession();
  }
};

module.exports = {
  checkout,
  getOrders,
  getOrderPdf,
  resendEmail,
  voidOrder,
};
