const batchService = require('./batchService');
const { HTTP_STATUS } = require('../../constants');

const batchController = {
  create: async (req, res, next) => {
    try {
      const batch = await batchService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { batch } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const batch = await batchService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { batch } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await batchService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const batch = await batchService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { batch } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await batchService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Batch deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = batchController;
