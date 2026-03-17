const analyticsService = require('../services/analyticsService');
const { HTTP_STATUS } = require('../constants');
const { withImageUrls } = require('../utils/productImages');

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
      const categories = data.map((c) => ({
        ...c,
        products: withImageUrls(c.products || []),
      }));
      res.status(HTTP_STATUS.OK).json({ success: true, data: { categories } });
    } catch (err) {
      next(err);
    }
  },

  topProducts: async (req, res, next) => {
    try {
      const limit = req.query.limit ?? 10;
      const products = await analyticsService.getTopProducts(limit);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { products: withImageUrls(products) } });
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
