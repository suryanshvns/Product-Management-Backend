const settingRepository = require('../repositories/settingRepository');

const settingService = {
  get: async (scope, scopeId, key) => {
    return settingRepository.get(scope, scopeId, key);
  },

  set: async (scope, scopeId, organizationId, key, value) => {
    return settingRepository.set(scope, scopeId, organizationId, key, value);
  },

  list: async (scope, scopeId) => {
    return settingRepository.list(scope, scopeId);
  },
};

module.exports = settingService;
