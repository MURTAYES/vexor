const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const SKU = require('../models/SKU');
const { clearCacheKeys } = require('./catalogController');
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

    res.status(201).json({ message: 'Order confirmed successfully', invoice_number: order.invoice_number, order_id: order._id });
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
  voidOrder,
};
