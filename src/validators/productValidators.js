const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

const productIdParam = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

const productIdImageIdParam = z.object({
  id: z.string().min(1, 'Product ID is required'),
  imageId: z.string().min(1, 'Image ID is required'),
});

const listProductsQuery = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  search: z.string().optional(),
  categoryId: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['draft', 'active', 'archived'], { required_error: 'Status is required' }),
});

const updateStockSchema = z.object({
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
});

const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
  status: z.enum(['draft', 'active', 'archived'], { required_error: 'Status is required' }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdParam,
  productIdImageIdParam,
  listProductsQuery,
  updateStatusSchema,
  updateStockSchema,
  bulkDeleteSchema,
  bulkUpdateStatusSchema,
};
