const dashboardService = require('../services/dashboardService');
const { HTTP_STATUS } = require('../constants');

const dashboardController = {
  summary: async (req, res, next) => {
    try {
      const data = await dashboardService.getSummary();
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dashboardController;
