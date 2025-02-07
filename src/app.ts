import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';
import express from 'express';
import Logger from './loaders/logger';
import authRoutes from './api/routes/auth'; // Import the correct route file here

async function startServer() {
  const app = express();
  app.use(express.json()); // Middleware for parsing JSON bodies

  // Load other loaders (database, etc.)
  await require('./loaders').default({ expressApp: app });

  // Use the auth routes with /auth as the base route
  app.use('/auth', authRoutes);
  // Catch-all route handler for unhandled routes
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Test route for validation
  app.use('/test', (req, res) => {
    res.send('Test route is working!');
  });

  // Start the server
  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();
