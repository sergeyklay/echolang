import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database';
import app from './app';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await disconnectDatabase();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await disconnectDatabase();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

