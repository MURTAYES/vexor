const Order = require('../models/Order');
const SKU = require('../models/SKU');
const logger = require('../utils/logger');

const getDashboardStats = async (req, res) => {
  try {
    const range = req.query.range || '7d';
    let startDate;
    let format = "%Y-%m-%d";

    if (range === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'monthly') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      format = "%Y-%m";
    } else if (range === 'yearly') {
      startDate = new Date(0); // All time
      format = "%Y";
    } else {
      // 7d default
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    const [statsAggregation, low_stock_alerts, total_skus] = await Promise.all([
      // 1. Order Aggregation
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'confirmed' } },
        { $facet: {
            daily_metrics: [
              { $group: {
                  _id: { $dateToString: { format: format, date: "$createdAt", timezone: "Asia/Dhaka" } },
                  sales: { $sum: "$total" },
                  profit: { $sum: "$total_profit" }
              }},
              { $sort: { "_id": 1 } }
            ],
            totals: [
              { $group: {
                  _id: null,
                  total_sales: { $sum: "$total" },
                  total_profit: { $sum: "$total_profit" }
              }}
            ],
            printed: [
              { $unwind: "$line_items" },
              { $match: { "line_items.printing.is_printed": true } },
              { $group: {
                  _id: null,
                  count: { $sum: "$line_items.quantity" }
              }}
            ],
            top_products: [
              { $unwind: "$line_items" },
              { $group: {
                  _id: "$line_items.product_name",
                  count: { $sum: "$line_items.quantity" }
              }},
              { $sort: { count: -1 } },
              { $limit: 5 }
            ]
        }}
      ]),

      // 2. Low-stock alerts (<= 3 and > 0)
      SKU.countDocuments({ stock_available: { $lte: 3, $gt: 0 } }),

      // 3. Total SKUs
      SKU.countDocuments()
    ]);

    const agg = statsAggregation[0];
    const totals = agg.totals[0] || { total_sales: 0, total_profit: 0 };
    const printed = agg.printed[0] || { count: 0 };

    res.json({
      total_sales: totals.total_sales,
      total_profit: totals.total_profit,
      jerseys_printed: printed.count,
      daily_metrics: agg.daily_metrics,
      top_products: agg.top_products || [],
      low_stock_alerts,
      total_skus
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching dashboard stats');
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = {
  getDashboardStats
};
