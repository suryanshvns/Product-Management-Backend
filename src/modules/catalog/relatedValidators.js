const { z } = require('zod');

const addRelatedSchema = z.object({
  productId: z.string().min(1),
  relatedProductId: z.string().min(1),
  relationType: z.enum(['related', 'upsell']).optional(),
}).refine((d) => d.productId !== d.relatedProductId, { message: 'Product cannot relate to itself' });

const removeRelatedSchema = z.object({
  productId: z.string().min(1),
  relatedProductId: z.string().min(1),
});

const productIdParam = z.object({ productId: z.string().min(1) });
const removeRelatedParams = z.object({
  productId: z.string().min(1),
  relatedProductId: z.string().min(1),
});
const listQuery = z.object({ relationType: z.enum(['related', 'upsell']).optional() });

module.exports = {
  addRelatedSchema,
  removeRelatedSchema,
  productIdParam,
  removeRelatedParams,
  listQuery,
};
