const searchService = require('./searchService');
const { HTTP_STATUS } = require('../../constants');

const searchController = {
  products: async (req, res, next) => {
    try {
      const result = await searchService.products(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = searchController;
