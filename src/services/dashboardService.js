const dashboardRepository = require('../repositories/dashboardRepository');

const dashboardService = {
  getSummary: async () => {
    return dashboardRepository.getSummary();
  },
};

module.exports = dashboardService;
