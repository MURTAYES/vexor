const { jwtVerify } = require('jose');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  return new TextEncoder().encode(secret);
};

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    
    // Check Redis denylist
    if (payload.jti) {
      try {
        const isDenylisted = await redisClient.get(`denylist:${payload.jti}`);
        if (isDenylisted) {
          return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
        }
      } catch (redisError) {
        // AUTH-05: Graceful degradation if Redis is down
        logger.warn({ err: redisError }, 'Redis check failed during auth middleware, allowing request gracefully');
      }
    }

    // Attach payload to request for downstream usage
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { requireAuth };
