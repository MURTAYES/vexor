const { z } = require('zod');
const { SignJWT } = require('jose');
const crypto = require('crypto');
const User = require('../models/User');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  return new TextEncoder().encode(secret);
};

const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { username, password } = result.data;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const jti = crypto.randomUUID();
    const jwt = await new SignJWT({ userId: user._id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(jti)
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getJwtSecret());

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    logger.error({ err: error }, 'Login error');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      // The auth middleware attaches req.user (which includes jti)
      // If logout is called, we should ideally decode or trust the middleware's extraction
      // If we don't have req.user (e.g. they called logout without being logged in), do nothing special.
      
      // To reliably get jti without full verification if not using middleware, 
      // but logout should be protected or at least decode the token.
      // We will assume logout is a protected route, so req.user is set by auth middleware.
      if (req.user && req.user.jti) {
        // Add to Redis denylist with an expiration that matches the token max age (7 days)
        // Set NX (Not eXists), EX (expire in seconds: 7 days)
        await redisClient.set(`denylist:${req.user.jti}`, 'true', 'EX', 7 * 24 * 60 * 60);
      }
    }

    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error({ err: error }, 'Logout error');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login, logout };
