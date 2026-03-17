const alertRuleRepository = require('../repositories/alertRuleRepository');
const { NotFoundError } = require('../utils/errors');

const alertRuleService = {
  create: async (data) => {
    return alertRuleRepository.create(data);
  },

  list: async (filters) => {
    return alertRuleRepository.findMany(filters);
  },

  getById: async (id) => {
    const rule = await alertRuleRepository.findById(id);
    if (!rule) throw new NotFoundError('Alert rule not found');
    return rule;
  },

  update: async (id, data) => {
    await alertRuleService.getById(id);
    return alertRuleRepository.update(id, data);
  },

  delete: async (id) => {
    await alertRuleService.getById(id);
    return alertRuleRepository.delete(id);
  },
};

module.exports = alertRuleService;
