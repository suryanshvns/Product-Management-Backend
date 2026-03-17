const webhookService = require('../services/webhookService');
const { HTTP_STATUS } = require('../constants');

const webhookController = {
  create: async (req, res, next) => {
    try {
      const webhook = await webhookService.create({
        ...req.body,
        userId: req.user.id,
      });
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { webhook } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const webhooks = await webhookService.list(req.user.id, req.query.organizationId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { webhooks } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const webhook = await webhookService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { webhook } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const webhook = await webhookService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { webhook } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await webhookService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Webhook deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = webhookController;
