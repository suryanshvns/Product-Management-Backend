const priceListService = require('./priceListService');
const { HTTP_STATUS } = require('../../constants');

const priceListController = {
  create: async (req, res, next) => {
    try {
      const priceList = await priceListService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { priceList } });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const priceList = await priceListService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { priceList } });
    } catch (err) {
      next(err);
    }
  },
  list: async (req, res, next) => {
    try {
      const result = await priceListService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const priceList = await priceListService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { priceList } });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await priceListService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Price list deleted' });
    } catch (err) {
      next(err);
    }
  },
  setItem: async (req, res, next) => {
    try {
      const item = await priceListService.setItem(req.params.id, req.body.productVariantId, req.body.price);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { item } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = priceListController;
