const activityLogRepository = require('./activity-log.repository');

const activityLogService = {
  list: async (filters) => {
    return activityLogRepository.findMany(filters);
  },

  log: async (userId, action, entity, entityId, options = {}) => {
    const { changeSummary, oldValues, newValues, metadata } = options;
    return activityLogRepository.create({
      userId: userId || null,
      action,
      entity,
      entityId: entityId || null,
      changeSummary: changeSummary ?? null,
      oldValues: oldValues ?? null,
      newValues: newValues ?? null,
      metadata: metadata ?? null,
    });
  },
};

module.exports = activityLogService;
