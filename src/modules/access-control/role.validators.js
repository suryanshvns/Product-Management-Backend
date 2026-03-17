const { z } = require('zod');

const assignRoleBody = z.object({
  roleId: z.string().cuid('Invalid role id'),
});

const userIdParam = z.object({
  userId: z.string().cuid('Invalid user id'),
});

const userIdRoleIdParams = z.object({
  userId: z.string().cuid('Invalid user id'),
  roleId: z.string().cuid('Invalid role id'),
});

module.exports = {
  assignRoleBody,
  userIdParam,
  userIdRoleIdParams,
};
