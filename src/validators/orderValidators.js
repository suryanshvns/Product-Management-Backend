const { z } = require('zod');

const createOrderSchema = z.object({
  organizationId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).or(z.string().transform((v) => parseInt(v, 10))),
        unitPrice: z.number().min(0).or(z.string().transform((v) => parseFloat(v))),
      })
    )
    .min(1, 'At least one item required'),
});

const orderIdParam = z.object({
  id: z.string().min(1),
});

const listOrdersQuery = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  status: z.string().optional(),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

module.exports = {
  createOrderSchema,
  orderIdParam,
  listOrdersQuery,
  updateStatusSchema,
};
