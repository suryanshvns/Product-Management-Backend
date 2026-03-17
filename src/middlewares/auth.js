const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');
const apiKeyService = require('../services/apiKeyService');

const authenticate = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      const keyRecord = await apiKeyService.findByKey(apiKey);
      if (!keyRecord || !keyRecord.userId) {
        throw new UnauthorizedError('Invalid API key');
      }
      req.user = { id: keyRecord.userId, email: null, roles: [] };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      roles: Array.isArray(decoded.roles) ? decoded.roles : [],
    };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) return next(err);
    logger.warn({ err }, 'Auth middleware: invalid token');
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      roles: Array.isArray(decoded.roles) ? decoded.roles : [],
    };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return next();
    }
    logger.warn({ err }, 'Auth middleware: invalid token');
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Require at least one of the given roles. Use after authenticate.
 * @param {string|string[]} allowedRoles - Role name or array of role names (e.g. 'admin' or ['superadmin', 'admin'])
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    const userRoles = req.user.roles || [];
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
};
