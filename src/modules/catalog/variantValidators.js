const { z } = require('zod');

const createVariantSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  attributes: z.record(z.unknown()).optional().nullable(),
  quantity: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  reorderQty: z.number().int().min(0).optional(),
  priceOverride: z.number().optional().nullable(),
});

const updateVariantSchema = z.object({
  sku: z.string().min(1).optional(),
  barcode: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  attributes: z.record(z.unknown()).optional().nullable(),
  quantity: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  reorderQty: z.number().int().min(0).optional(),
  priceOverride: z.number().optional().nullable(),
});

const variantIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  productId: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const stockDeltaSchema = z.object({ delta: z.coerce.number() });

module.exports = {
  createVariantSchema,
  updateVariantSchema,
  variantIdParam,
  listQuery,
  stockDeltaSchema,
};
