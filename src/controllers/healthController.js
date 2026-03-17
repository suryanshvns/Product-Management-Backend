const healthService = require('../services/healthService');
const { HTTP_STATUS } = require('../constants');

const getHealth = async (req, res, next) => {
  try {
    const health = await healthService.getHealth();
    const statusCode =
      health.status === 'healthy'
        ? HTTP_STATUS.OK
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(health);
  } catch (err) {
    next(err);
  }
};

const ping = (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealth,
  ping,
};
