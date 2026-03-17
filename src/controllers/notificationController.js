const notificationService = require('../services/notificationService');
const { HTTP_STATUS } = require('../constants');

const notificationController = {
  list: async (req, res, next) => {
    try {
      const result = await notificationService.list(req.user.id, {
        page: req.query.page,
        limit: req.query.limit,
        unreadOnly: req.query.unreadOnly,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      await notificationService.markAsRead(req.params.id, req.user.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Marked as read' });
    } catch (err) {
      next(err);
    }
  },

  markAllAsRead: async (req, res, next) => {
    try {
      await notificationService.markAllAsRead(req.user.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'All marked as read' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = notificationController;
