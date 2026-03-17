const { z } = require('zod');

const createAddressSchema = z.object({
  customerId: z.string().min(1),
  label: z.string().optional().nullable(),
  line1: z.string().min(1),
  line2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().optional().nullable(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean().optional(),
});

const updateAddressSchema = z.object({
  label: z.string().optional().nullable(),
  line1: z.string().optional(),
  line2: z.string().optional().nullable(),
  city: z.string().optional(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

const addressIdParam = z.object({ id: z.string().min(1) });
const customerIdParam = z.object({ customerId: z.string().min(1) });

module.exports = {
  createAddressSchema,
  updateAddressSchema,
  addressIdParam,
  customerIdParam,
};
