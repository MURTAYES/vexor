const express = require('express');
const { login, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);

// A dummy protected route for testing
router.get('/me', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;
