const errorHandler = require('./errorHandler');
const requestLogger = require('./requestLogger');
const { authenticate, optionalAuth, requireRole } = require('./auth');
const validate = require('./validate');

module.exports = {
  errorHandler,
  requestLogger,
  authenticate,
  optionalAuth,
  requireRole,
  validate,
};
