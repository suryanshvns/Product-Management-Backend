const orderService = require('./order.service');
const { HTTP_STATUS } = require('../../constants');

const orderController = {
  create: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.user.id, req.body.organizationId, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await orderService.listOrders({
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status,
        userId: req.query.userId || req.user?.id,
        organizationId: req.query.organizationId,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = orderController;
