const { z } = require('zod');

const createCustomerSchema = z.object({
  organizationId: z.string().optional().nullable(),
  customerGroupId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

const updateCustomerSchema = z.object({
  customerGroupId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  contactName: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

const customerIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  organizationId: z.string().optional(),
  customerGroupId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParam,
  listQuery,
};
