const { z } = require('zod');

const searchQuerySchema = z.object({
  q: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : (v ? [v] : []))).optional(),
  tagSlug: z.string().optional(),
  inStock: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = { searchQuerySchema };
