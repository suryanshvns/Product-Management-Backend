const bulkImportService = require('../services/bulkImportService');
const { HTTP_STATUS } = require('../constants');

const bulkImportController = {
  importProducts: async (req, res, next) => {
    try {
      const csvText = typeof req.body === 'string' ? req.body : (req.body?.csv || req.body?.data || '');
      if (!csvText) {
        return res.status(400).json({
          success: false,
          error: { message: 'Send CSV as raw text body or { csv: "..." }' },
        });
      }
      const result = await bulkImportService.importProducts(csvText);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bulkImportController;
