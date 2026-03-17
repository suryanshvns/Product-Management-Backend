const analyticsRepository = require('./analytics.repository');

const analyticsService = {
  getOverview: async () => {
    return analyticsRepository.getOverview();
  },

  getProductsByCategory: async () => {
    return analyticsRepository.getProductsByCategory();
  },

  getTopProducts: async (limit = 10) => {
    return analyticsRepository.getTopProducts(limit);
  },

  getInventoryStatus: async () => {
    return analyticsRepository.getInventoryStatus();
  },
};

module.exports = analyticsService;
