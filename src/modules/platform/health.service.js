const healthRepository = require('./health.repository');

const getHealth = async () => {
  const status = { app: 'ok', database: 'unknown' };

  try {
    await healthRepository.checkDatabase();
    status.database = 'ok';
  } catch (err) {
    status.database = 'error';
    status.databaseError = err.message;
  }

  return {
    status: status.database === 'ok' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: status,
  };
};

module.exports = {
  getHealth,
};
