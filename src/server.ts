import { createServer } from 'http';
import app from './app';
import { config } from './config';
import { initializeSocket } from './sockets';

const PORT = config.PORT || 3000;

const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running in ${config.NODE_ENV} mode on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  httpServer.close(() => {
    process.exit(1);
  });
});
