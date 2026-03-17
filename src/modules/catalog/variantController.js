const variantService = require('./variantService');
const { HTTP_STATUS } = require('../../constants');

const variantController = {
  create: async (req, res, next) => {
    try {
      const variant = await variantService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { variant } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const variant = await variantService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { variant } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await variantService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const variant = await variantService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { variant } });
    } catch (err) {
      next(err);
    }
  },

  updateStock: async (req, res, next) => {
    try {
      const delta = parseInt(req.body.delta, 10);
      const variant = await variantService.updateStock(req.params.id, delta);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { variant } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await variantService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Variant deleted' });
    } catch (err) {
      next(err);
    }
  },

  reorderSuggestions: async (req, res, next) => {
    try {
      const suggestions = await variantService.reorderSuggestions(req.query.organizationId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { suggestions } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = variantController;
