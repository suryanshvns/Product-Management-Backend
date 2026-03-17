const { z } = require('zod');

const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional().nullable(),
});

const productIdParam = z.object({ productId: z.string().min(1) });
const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  productIdParam,
  listQuery,
};
