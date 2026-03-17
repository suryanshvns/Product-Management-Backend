const { z } = require('zod');

const topProductsQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10) || 10, 100) : 10)),
});

module.exports = {
  topProductsQuery,
};
