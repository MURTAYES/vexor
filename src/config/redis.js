const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisUri = process.env.REDIS_URI || 'redis://localhost:6379';

// INFRA-02: Redis client with graceful degradation (lazyConnect, error handler)
const redisClient = new Redis(redisUri, {
  lazyConnect: true,
  retryStrategy(times) {
    // Retry connection after delays, max out at 3 seconds
    const delay = Math.min(times * 50, 3000);
    return delay;
  },
  maxRetriesPerRequest: 3, // Don't block requests indefinitely if Redis is down
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
