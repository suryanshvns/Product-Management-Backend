const invoiceService = require('./invoiceService');
const { HTTP_STATUS } = require('../../constants');

const invoiceController = {
  generate: async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const organizationId = req.user?.organizationId ?? req.body.organizationId;
      const invoice = await invoiceService.generateForOrder(orderId, organizationId);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { invoice } });
    } catch (err) {
      next(err);
    }
  },

  getByOrderId: async (req, res, next) => {
    try {
      const invoice = await invoiceService.getByOrderId(req.params.orderId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { invoice } });
    } catch (err) {
      next(err);
    }
  },

  getByNumber: async (req, res, next) => {
    try {
      const invoice = await invoiceService.getByInvoiceNumber(req.params.invoiceNumber);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { invoice } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await invoiceService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  html: async (req, res, next) => {
    try {
      const invoice = await invoiceService.getByOrderId(req.params.orderId);
      res.set('Content-Type', 'text/html');
      res.send(invoice.htmlBody || '');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = invoiceController;
