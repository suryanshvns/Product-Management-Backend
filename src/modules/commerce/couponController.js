const couponService = require('./couponService');
const { HTTP_STATUS } = require('../../constants');

const couponController = {
  create: async (req, res, next) => {
    try {
      const coupon = await couponService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { coupon } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const coupon = await couponService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { coupon } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await couponService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const coupon = await couponService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { coupon } });
    } catch (err) {
      next(err);
    }
  },

  validate: async (req, res, next) => {
    try {
      const { code, orderAmount } = req.body;
      const result = await couponService.validate(code, orderAmount);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = couponController;
