const Product = require('../models/Product');
const SKU = require('../models/SKU');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

// Cache-aside helper
const getOrSetCache = async (key, ttl, fetcher) => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    logger.warn({ err: error }, `Redis GET failed for key: ${key}`);
  }

  const data = await fetcher();

  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (error) {
    logger.warn({ err: error }, `Redis SET failed for key: ${key}`);
  }

  return data;
};

// Helper for invalidation (INFRA-04 prep)
const clearCacheKeys = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.warn({ err: error }, `Redis KEYS/DEL failed for pattern: ${pattern}`);
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const cacheKey = `catalog:products:page:${page}:limit:${limit}`;

    const data = await getOrSetCache(cacheKey, 300, async () => {
      const [products, total] = await Promise.all([
        Product.find({ active_status: true })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments({ active_status: true }),
      ]);
      return { products, total, page, limit };
    });

    return res.status(200).json(data);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching products');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'Search query "q" is required' });
    }

    const cacheKey = `catalog:search:${q}`;

    const data = await getOrSetCache(cacheKey, 300, async () => {
      // PROD-07: MongoDB text search
      return await Product.find(
        { $text: { $search: q }, active_status: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    });

    return res.status(200).json({ products: data });
  } catch (error) {
    logger.error({ err: error }, 'Error searching products');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductSkus = async (req, res) => {
  try {
    const productId = req.params.id;
    const cacheKey = `catalog:product:${productId}:skus`;

    const data = await getOrSetCache(cacheKey, 60, async () => {
      return await SKU.find({ product_id: productId }).lean();
    });

    return res.status(200).json({ skus: data });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching SKUs');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProductSkus,
  clearCacheKeys,
};
