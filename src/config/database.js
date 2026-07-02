const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      logger.fatal('MONGODB_URI environment variable is missing.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      // Mongoose 6+ connects directly with default options, but we explicitly note it here
      // Replica set name is usually provided in the connection string (e.g., ?replicaSet=rs0)
    });

    logger.info('MongoDB connected successfully');

    // INFRA-06: Fatal error if MongoDB replica set is not configured (required for transactions)
    try {
      const adminDb = mongoose.connection.db.admin();
      const replStatus = await adminDb.command({ replSetGetStatus: 1 });
      if (!replStatus || replStatus.ok !== 1) {
        throw new Error('Replica set status not ok');
      }
      logger.info(`MongoDB Replica Set detected: ${replStatus.set}`);
    } catch (error) {
      logger.fatal(
        'MongoDB is NOT running as a replica set. Vexor requires a replica set for transactions. Exiting.'
      );
      process.exit(1);
    }
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};

module.exports = { connectDB };
