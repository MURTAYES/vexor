require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { program } = require('commander');
const User = require('../src/models/User');
const logger = require('../src/utils/logger');

program
  .requiredOption('-u, --username <username>', 'Username for the seller')
  .requiredOption('-p, --password <password>', 'Password for the seller')
  .parse(process.argv);

const options = program.opts();

const createSeller = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      logger.fatal('MONGODB_URI is required');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);

    const existingUser = await User.findOne({ username: options.username });
    if (existingUser) {
      logger.error(`User '${options.username}' already exists.`);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(options.password, salt);

    const user = new User({
      username: options.username,
      passwordHash,
    });

    await user.save();
    logger.info(`Successfully created seller account: ${options.username}`);
  } catch (error) {
    logger.error({ err: error }, 'Failed to create seller');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createSeller();
