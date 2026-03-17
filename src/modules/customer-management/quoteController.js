const quoteService = require('./quoteService');
const { HTTP_STATUS } = require('../../constants');

const quoteController = {
  create: async (req, res, next) => {
    try {
      const quote = await quoteService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { quote } });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const quote = await quoteService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { quote } });
    } catch (err) {
      next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const result = await quoteService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const quote = await quoteService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { quote } });
    } catch (err) {
      next(err);
    }
  },
  addLine: async (req, res, next) => {
    try {
      const line = await quoteService.addLine(req.params.id, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { line } });
    } catch (err) {
      next(err);
    }
  },
  removeLine: async (req, res, next) => {
    try {
      const quote = await quoteService.removeLine(req.params.id, req.params.lineId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { quote } });
    } catch (err) {
      next(err);
    }
  },
  convertToOrder: async (req, res, next) => {
    try {
      const order = await quoteService.convertToOrder(
        req.params.id,
        req.user?.id,
        req.body.organizationId || req.user?.organizationId
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = quoteController;
