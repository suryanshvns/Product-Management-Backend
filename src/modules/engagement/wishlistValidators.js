const { z } = require('zod');

const addWishlistSchema = z.object({ productId: z.string().min(1) });
const productIdParam = z.object({ productId: z.string().min(1) });
const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = { addWishlistSchema, productIdParam, listQuery };
