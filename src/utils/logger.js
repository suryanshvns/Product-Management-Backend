const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.logging.level,
  transport:
    config.env === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: {
    service: 'product-management-api',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
