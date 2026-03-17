const roleService = require('../services/roleService');
const { HTTP_STATUS } = require('../constants');

const roleController = {
  list: async (req, res, next) => {
    try {
      const roles = await roleService.listRoles();
      res.status(HTTP_STATUS.OK).json({ success: true, data: { roles } });
    } catch (err) {
      next(err);
    }
  },

  assign: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;
      const result = await roleService.assignRoleToUser(userId, roleId);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  revoke: async (req, res, next) => {
    try {
      const { userId, roleId } = req.params;
      const result = await roleService.revokeRoleFromUser(userId, roleId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = roleController;
