const activityLogRepository = require('../repositories/activityLogRepository');

const activityLogService = {
  list: async (filters) => {
    return activityLogRepository.findMany(filters);
  },

  log: async (userId, action, entity, entityId, metadata) => {
    return activityLogRepository.create({
      userId: userId || null,
      action,
      entity,
      entityId: entityId || null,
      metadata: metadata || null,
    });
  },
};

module.exports = activityLogService;
