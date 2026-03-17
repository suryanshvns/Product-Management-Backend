const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

const categoryIdParam = z.object({
  id: z.string().min(1, 'Category ID is required'),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParam,
};
