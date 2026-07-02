const mongoose = require('mongoose');

// Embedded Line Item Snapshot
const lineItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SKU',
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    snapshot_price: {
      type: Number,
      required: true,
      min: 0,
    },
    special_instruction: {
      type: String,
      maxlength: 300,
    },
  },
  { _id: false } // No need for separate ObjectIds for embedded documents
);

const orderSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: String,
      unique: true,
    },
    line_items: [lineItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_phone: {
      type: String,
      required: true,
      trim: true,
    },
    customer_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'voided'],
      default: 'confirmed',
    },
    email_sent_at: Date,
    email_error: String,
  },
  { timestamps: true }
);

// We need a Counter model to generate sequential invoice numbers safely
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Pre-save hook to generate VX-YYYYMMDD-NNN
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    try {
      // Find the counter for today and increment it atomically
      const counterId = `invoice_${datePrefix}`;
      const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // upsert creates it if it doesn't exist
      );

      // Pad sequence to 3 digits (e.g. 001)
      const seqStr = String(counter.seq).padStart(3, '0');
      this.invoice_number = `VX-${datePrefix}-${seqStr}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema);
