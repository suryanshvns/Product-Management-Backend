const { z } = require('zod');

const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
});

const tagIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  slug: z.string().optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const productTagsSchema = z.object({ tagIds: z.array(z.string()).min(0) });
const productIdParam = z.object({ productId: z.string().min(1) });
const bulkUpdateSchema = z.object({
  tagId: z.string().min(1),
  productIdsToAdd: z.array(z.string()).optional(),
  productIdsToRemove: z.array(z.string()).optional(),
});

module.exports = {
  createTagSchema,
  updateTagSchema,
  tagIdParam,
  listQuery,
  productTagsSchema,
  productIdParam,
  bulkUpdateSchema,
};
