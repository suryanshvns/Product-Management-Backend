const customerGroupService = require('./customerGroupService');
const { HTTP_STATUS } = require('../../constants');

const customerGroupController = {
  create: async (req, res, next) => {
    try {
      const group = await customerGroupService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { group } });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const group = await customerGroupService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { group } });
    } catch (err) {
      next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const result = await customerGroupService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const group = await customerGroupService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { group } });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await customerGroupService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Group deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = customerGroupController;
