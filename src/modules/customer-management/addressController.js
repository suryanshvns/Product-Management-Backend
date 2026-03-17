const addressService = require('./addressService');
const { HTTP_STATUS } = require('../../constants');

const addressController = {
  create: async (req, res, next) => {
    try {
      const address = await addressService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { address } });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const address = await addressService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { address } });
    } catch (err) {
      next(err);
    }
  },
  listByCustomer: async (req, res, next) => {
    try {
      const addresses = await addressService.listByCustomer(req.params.customerId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { addresses } });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const address = await addressService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { address } });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await addressService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Address deleted' });
    } catch (err) {
      next(err);
    }
  },
  setDefault: async (req, res, next) => {
    try {
      const address = await addressService.setDefault(req.params.customerId, req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { address } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = addressController;
