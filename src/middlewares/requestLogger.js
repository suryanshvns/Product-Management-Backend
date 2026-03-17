const logger = require('../utils/logger');

/**
 * Structured request logging middleware.
 * Logs after response is finished.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('user-agent'),
      },
      'HTTP request'
    );
  });

  next();
};

module.exports = requestLogger;
