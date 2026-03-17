const { z } = require('zod');

const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const organizationIdParam = z.object({
  id: z.string().min(1),
});

const addMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.string().default('member'),
});

module.exports = {
  createOrganizationSchema,
  organizationIdParam,
  addMemberSchema,
};
