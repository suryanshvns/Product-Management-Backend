const { z } = require('zod');

const createBatchSchema = z.object({
  productVariantId: z.string().min(1),
  batchNumber: z.string().min(1),
  expiryDate: z.coerce.date().optional().nullable(),
  quantity: z.number().int().min(0).optional(),
});

const updateBatchSchema = z.object({
  batchNumber: z.string().optional(),
  expiryDate: z.coerce.date().optional().nullable(),
  quantity: z.number().int().min(0).optional(),
});

const batchIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  productVariantId: z.string().optional(),
  expiryBefore: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  createBatchSchema,
  updateBatchSchema,
  batchIdParam,
  listQuery,
};
