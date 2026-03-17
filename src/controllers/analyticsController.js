const analyticsService = require('../services/analyticsService');
const { HTTP_STATUS } = require('../constants');

const analyticsController = {
  overview: async (req, res, next) => {
    try {
      const data = await analyticsService.getOverview();
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  productsByCategory: async (req, res, next) => {
    try {
      const data = await analyticsService.getProductsByCategory();
      res.status(HTTP_STATUS.OK).json({ success: true, data: { categories: data } });
    } catch (err) {
      next(err);
    }
  },

  topProducts: async (req, res, next) => {
    try {
      const limit = req.query.limit ?? 10;
      const products = await analyticsService.getTopProducts(limit);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { products } });
    } catch (err) {
      next(err);
    }
  },

  inventoryStatus: async (req, res, next) => {
    try {
      const data = await analyticsService.getInventoryStatus();
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = analyticsController;
