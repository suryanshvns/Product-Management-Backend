const apiKeyService = require('../services/apiKeyService');
const { HTTP_STATUS } = require('../constants');

const apiKeyController = {
  create: async (req, res, next) => {
    try {
      const { rawKey } = await apiKeyService.create(
        req.body.name,
        req.user.id,
        req.body.organizationId
      );
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: { apiKey: rawKey, message: 'Store this key; it will not be shown again.' },
      });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const keys = await apiKeyService.list(req.user.id, req.query.organizationId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { apiKeys: keys } });
    } catch (err) {
      next(err);
    }
  },

  revoke: async (req, res, next) => {
    try {
      await apiKeyService.revoke(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'API key revoked' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = apiKeyController;
