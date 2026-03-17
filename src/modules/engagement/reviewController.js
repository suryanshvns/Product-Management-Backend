const reviewService = require('./reviewService');
const { HTTP_STATUS } = require('../../constants');

const reviewController = {
  create: async (req, res, next) => {
    try {
      const review = await reviewService.create(req.user.id, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { review } });
    } catch (err) {
      next(err);
    }
  },
  getByProduct: async (req, res, next) => {
    try {
      const result = await reviewService.getByProduct(req.params.productId, req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const review = await reviewService.update(req.user.id, req.params.productId, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { review } });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await reviewService.delete(req.user.id, req.params.productId);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reviewController;
