const dashboardRepository = require('./dashboard.repository');

const dashboardService = {
  getSummary: async () => {
    return dashboardRepository.getSummary();
  },
};

module.exports = dashboardService;
