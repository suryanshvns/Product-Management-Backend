const { z } = require('zod');

const createQuoteSchema = z.object({
  customerId: z.string().min(1),
  organizationId: z.string().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
});

const updateQuoteSchema = z.object({
  status: z.enum(['draft', 'sent', 'accepted', 'expired', 'converted']).optional(),
  validUntil: z.coerce.date().optional().nullable(),
});

const addLineSchema = z.object({
  productVariantId: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
});

const quoteIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  customerId: z.string().optional(),
  status: z.string().optional(),
  organizationId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  createQuoteSchema,
  updateQuoteSchema,
  addLineSchema,
  quoteIdParam,
  listQuery,
};
