const relatedService = require('./relatedService');
const { HTTP_STATUS } = require('../../constants');

const relatedController = {
  add: async (req, res, next) => {
    try {
      const { productId, relatedProductId, relationType } = req.body;
      const relation = await relatedService.add(productId, relatedProductId, relationType);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { relation } });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { productId, relatedProductId } = req.params;
      await relatedService.remove(productId, relatedProductId);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Relation removed' });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const products = await relatedService.list(req.params.productId, req.query.relationType);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { products } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = relatedController;
