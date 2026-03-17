const { z } = require('zod');

const createPriceListSchema = z.object({
  name: z.string().min(1),
  organizationId: z.string().optional().nullable(),
  customerGroupId: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
});
const updatePriceListSchema = z.object({ name: z.string().optional(), customerGroupId: z.string().optional().nullable(), isDefault: z.boolean().optional() });
const priceListIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({ organizationId: z.string().optional(), page: z.coerce.number().int().min(1).optional(), limit: z.coerce.number().int().min(1).max(100).optional() });
const setItemSchema = z.object({ productVariantId: z.string().min(1), price: z.number().min(0) });

module.exports = { createPriceListSchema, updatePriceListSchema, priceListIdParam, listQuery, setItemSchema };
