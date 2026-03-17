const alertRuleService = require('../services/alertRuleService');
const { HTTP_STATUS } = require('../constants');

const alertRuleController = {
  create: async (req, res, next) => {
    try {
      const rule = await alertRuleService.create({
        ...req.body,
        userId: req.body.userId || req.user.id,
      });
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { alertRule: rule } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const rules = await alertRuleService.list(req.query);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { alertRules: rules } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const rule = await alertRuleService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { alertRule: rule } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const rule = await alertRuleService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { alertRule: rule } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await alertRuleService.delete(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Alert rule deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = alertRuleController;
