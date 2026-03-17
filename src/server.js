const app = require('./app');
const config = require('./config');
const { connect, disconnect } = require('./database/client');
const logger = require('./utils/logger');

const server = app.listen(config.port, async () => {
  try {
    await connect();
    logger.info(`Server listening on port ${config.port} (env: ${config.env})`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
});

const shutdown = async () => {
  logger.info('Shutting down...');
  server.close(async () => {
    await disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
