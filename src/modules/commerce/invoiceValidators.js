const { z } = require('zod');

const generateInvoiceSchema = z.object({ orderId: z.string().min(1) });
const orderIdParam = z.object({ orderId: z.string().min(1) });
const invoiceNumberParam = z.object({ invoiceNumber: z.string().min(1) });
const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  generateInvoiceSchema,
  orderIdParam,
  invoiceNumberParam,
  listQuery,
};
