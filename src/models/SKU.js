const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku_id: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    stock_available: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    cost_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// A product can only have one SKU per size
skuSchema.index({ product_id: 1, size: 1 }, { unique: true });

module.exports = mongoose.model('SKU', skuSchema);
