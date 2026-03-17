const { z } = require('zod');

const createGroupSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  organizationId: z.string().optional().nullable(),
});

const updateGroupSchema = z.object({ name: z.string().min(1).optional(), slug: z.string().optional() });
const groupIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  organizationId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = { createGroupSchema, updateGroupSchema, groupIdParam, listQuery };
