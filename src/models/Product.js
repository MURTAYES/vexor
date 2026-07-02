const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    club_country_name: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    kit_type: {
      type: String,
      required: true,
      enum: ['Home', 'Away', 'Third', 'Goalkeeper', 'Special'],
    },
    version: {
      type: String,
      required: true,
      enum: ['General', 'Retro', 'Player Issue'],
    },
    image_url: {
      type: String,
      required: true,
    },
    base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    active_status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// PROD-06: Duplicate product prevented by unique compound index
productSchema.index({ club_country_name: 1, season: 1, kit_type: 1, version: 1 }, { unique: true });

// PROD-07: Seller can search products by keyword (MongoDB text index)
productSchema.index({ club_country_name: 'text', season: 'text' });

module.exports = mongoose.model('Product', productSchema);
