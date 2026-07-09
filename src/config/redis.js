const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisUri = process.env.REDIS_URI || 'redis://localhost:6379';

// INFRA-02: Redis client with graceful degradation (lazyConnect, error handler)
const redisClient = new Redis(redisUri, {
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 5) {
      logger.warn('Redis: max retries reached, giving up. Cache features disabled.');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 3000);
  },
  maxRetriesPerRequest: 1, // Fail fast on individual requests
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (err) => {
  // Graceful degradation: log the error but don't crash the app
  logger.warn(`Redis connection error: ${err.message}. Cache-aside features will degrade gracefully.`);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    // We already handle 'error' events above, but lazyConnect requires explicit try/catch for the initial connect
    logger.warn('Initial Redis connection failed. Retrying in background...');
  }
};

module.exports = { redisClient, connectRedis };
