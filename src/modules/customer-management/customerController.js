const customerService = require('./customerService');
const { HTTP_STATUS } = require('../../constants');

const customerController = {
  create: async (req, res, next) => {
    try {
      const customer = await customerService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { customer } });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const customer = await customerService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { customer } });
    } catch (err) {
      next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const result = await customerService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const customer = await customerService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { customer } });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await customerService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Customer deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = customerController;
