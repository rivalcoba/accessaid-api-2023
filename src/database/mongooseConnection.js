import mongoose from 'mongoose';
import logger from '../config/winston';

// Mongoose connection
export default async function connectWithRetry(mongoUrl) {
  try {
    await mongoose.connect(mongoUrl);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`🥀 Failed to connect to MongoDB 🥀: ${error.message}`);
    logger.error('Retrying in 20 seconds.'); // Retry connection after 5 minutes
    setTimeout(() => connectWithRetry(mongoUrl), 20000);
  }
}
