const reportService = require('../services/reportService');
const { HTTP_STATUS } = require('../constants');

const reportController = {
  sales: async (req, res, next) => {
    try {
      const data = await reportService.salesReport(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  inventory: async (req, res, next) => {
    try {
      const data = await reportService.inventoryReport();
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  exportProducts: async (req, res, next) => {
    try {
      const csv = await reportService.exportProductsCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
      res.status(HTTP_STATUS.OK).send(csv);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reportController;
