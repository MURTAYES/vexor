const Product = require('../models/Product');
const SKU = require('../models/SKU');
const { clearCacheKeys } = require('./catalogController');
const logger = require('../utils/logger');
const { z } = require('zod');

// Helpers for SKU generation (INV-01)
const generateSkuId = (club, season, kit, version, size) => {
  const codeClub = club.substring(0, 3).toUpperCase();
  const codeSeason = season.replace(/[^0-9]/g, '').substring(0, 4); // e.g., "24/25" -> "2425"
  const codeKit = kit.charAt(0).toUpperCase();
  const codeVersion = version.charAt(0).toUpperCase();
  return `${codeClub}-${codeSeason}-${codeKit}-${codeVersion}-${size}`;
};

const productSchema = z.object({
  club_country_name: z.string().min(1),
  season: z.string().min(1),
  kit_type: z.enum(['Home', 'Away', 'Third', 'Goalkeeper', 'Special']),
  version: z.enum(['General', 'Retro', 'Player Issue']),
  image_url: z.string().url(),
  base_price: z.number().min(0).optional(),
  initial_stock: z.record(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']), z.object({
    stock: z.number().min(0),
    cost_price: z.number().min(0)
  })),
});

const createProduct = async (req, res) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const {
      club_country_name,
      season,
      kit_type,
      version,
      image_url,
      base_price,
      initial_stock,
    } = parsed.data;

    const product = new Product({
      club_country_name,
      season,
      kit_type,
      version,
      image_url,
      base_price: base_price || 0,
      active_status: true,
    });

    try {
      await product.save();
    } catch (dbError) {
      if (dbError.code === 11000) {
        // PROD-06
        return res.status(409).json({ error: 'A product with this club, season, kit type, and version already exists.' });
      }
      throw dbError;
    }

    const skuPromises = Object.entries(initial_stock).map(([size, data]) => {
      const sku_id = generateSkuId(club_country_name, season, kit_type, version, size);
      const sku = new SKU({
        product_id: product._id,
        sku_id,
        size,
        stock_available: data.stock,
        cost_price: data.cost_price,
      });
      return sku.save();
    });

    await Promise.all(skuPromises);
    await clearCacheKeys('catalog:*'); // Invalidate cache

    res.status(201).json({ message: 'Product created successfully', product_id: product._id });
  } catch (error) {
    logger.error({ err: error }, 'Error creating product');
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // Allow partial updates
    const updates = req.body;
    
    // Validate updates if needed, skipping full Zod for brevity/partial updates
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await clearCacheKeys('catalog:*');
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    logger.error({ err: error }, 'Error updating product');
    res.status(500).json({ error: 'Internal server error' });
  }
};

const restockSku = async (req, res) => {
  try {
    const skuId = req.params.id;
    const { quantity, cost_price } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid restock quantity required' });
    }

    const updateFields = { $inc: { stock_available: quantity } };
    if (cost_price !== undefined && cost_price !== null && cost_price >= 0) {
      updateFields.$set = { cost_price };
    }

    // INV-03: Unconditional increment via PATCH
    const sku = await SKU.findByIdAndUpdate(
      skuId,
      updateFields,
      { new: true }
    );

    if (!sku) {
      return res.status(404).json({ error: 'SKU not found' });
    }

    await clearCacheKeys('catalog:*');
    res.status(200).json({ message: 'SKU restocked', sku });
  } catch (error) {
    logger.error({ err: error }, 'Error restocking SKU');
    res.status(500).json({ error: 'Internal server error' });
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // Construct the URL to access the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
};

const deleteProduct = async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== 'vexor') {
      return res.status(403).json({ error: 'Invalid master password' });
    }

    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Optional: Check if product has associated orders here if needed, but not specified.
    // We will just delete the product and its SKUs.
    await SKU.deleteMany({ product_id: productId });
    await Product.findByIdAndDelete(productId);

    await clearCacheKeys('catalog:*');
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting product');
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  restockSku,
  uploadImage,
  deleteProduct,
};
