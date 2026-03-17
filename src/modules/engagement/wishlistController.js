const wishlistService = require('./wishlistService');
const { HTTP_STATUS } = require('../../constants');

const wishlistController = {
  add: async (req, res, next) => {
    try {
      const item = await wishlistService.add(req.user.id, req.body.productId);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { item } });
    } catch (err) {
      next(err);
    }
  },
  remove: async (req, res, next) => {
    try {
      await wishlistService.remove(req.user.id, req.params.productId);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Removed from wishlist' });
    } catch (err) {
      next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const result = await wishlistService.list(req.user.id, req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = wishlistController;
