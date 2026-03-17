const tagService = require('./tagService');
const { HTTP_STATUS } = require('../../constants');

const tagController = {
  create: async (req, res, next) => {
    try {
      const tag = await tagService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { tag } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const tag = await tagService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { tag } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await tagService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const tag = await tagService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { tag } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await tagService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Tag deleted' });
    } catch (err) {
      next(err);
    }
  },

  setProductTags: async (req, res, next) => {
    try {
      const product = await tagService.setProductTags(req.params.productId, req.body.tagIds || []);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product } });
    } catch (err) {
      next(err);
    }
  },

  bulkUpdate: async (req, res, next) => {
    try {
      const { tagId, productIdsToAdd, productIdsToRemove } = req.body;
      const tag = await tagService.bulkUpdateTag(tagId, productIdsToAdd, productIdsToRemove);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { tag } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = tagController;
