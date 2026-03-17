const { z } = require('zod');

const listUsersQuery = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

const updateUserBody = z.object({
  name: z.string().min(1).optional(),
});

const userIdParam = z.object({
  id: z.string().cuid(),
});

module.exports = {
  listUsersQuery,
  updateUserBody,
  userIdParam,
};
