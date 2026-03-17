const activityLogService = require('../services/activityLogService');
const { HTTP_STATUS } = require('../constants');

const logController = {
  list: async (req, res, next) => {
    try {
      const result = await activityLogService.list({
        page: req.query.page,
        limit: req.query.limit,
        userId: req.query.userId,
        entity: req.query.entity,
        entityId: req.query.entityId,
        action: req.query.action,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = logController;
