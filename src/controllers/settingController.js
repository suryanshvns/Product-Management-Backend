const settingService = require('../services/settingService');
const { HTTP_STATUS } = require('../constants');

const settingController = {
  get: async (req, res, next) => {
    try {
      const value = await settingService.get(
        req.query.scope,
        req.query.scopeId,
        req.query.key
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data: { value } });
    } catch (err) {
      next(err);
    }
  },

  set: async (req, res, next) => {
    try {
      const setting = await settingService.set(
        req.body.scope,
        req.body.scopeId,
        req.body.organizationId,
        req.body.key,
        req.body.value
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data: { setting } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const settings = await settingService.list(req.query.scope, req.query.scopeId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { settings } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = settingController;
