const userService = require('../services/userService');
const { HTTP_STATUS } = require('../constants');
const { ForbiddenError } = require('../utils/errors');

const canManageUser = (req, userId) => {
  return req.user.id === userId || (req.user.roles || []).includes('superadmin') || (req.user.roles || []).includes('admin');
};

const userController = {
  list: async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;
      const result = await userService.listUsers({ page, limit, search });
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!canManageUser(req, id)) {
        throw new ForbiddenError('Insufficient permissions to view this user');
      }
      const result = await userService.getUserById(id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { user: result } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!canManageUser(req, id)) {
        throw new ForbiddenError('Insufficient permissions to update this user');
      }
      const data = req.body;
      const result = await userService.updateUser(id, data);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { user: result } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
