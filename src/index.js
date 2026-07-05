require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('./utils/logger');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// To be added in later plans:
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', catalogRoutes);
app.use('/api/products', productRoutes); // Mutations on /api/products
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

const startServer = async () => {
  // Wait for connections before accepting requests
  await connectDB();
  await connectRedis();

  app.listen(port, () => {
    logger.info(`Vexor API server listening on port ${port}`);
  });
};

// Don't start server automatically if running tests or being required
if (require.main === module) {
  startServer();
}

module.exports = app;
