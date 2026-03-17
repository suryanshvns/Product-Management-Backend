const { z } = require('zod');

const createCouponSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['PERCENT', 'FIXED']),
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).optional().nullable(),
  validFrom: z.coerce.date().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  maxUses: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
  organizationId: z.string().optional().nullable(),
});

const updateCouponSchema = z.object({
  discountType: z.enum(['PERCENT', 'FIXED']).optional(),
  value: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).optional().nullable(),
  validFrom: z.coerce.date().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  maxUses: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
});

const validateCouponSchema = z.object({ code: z.string().min(1), orderAmount: z.number().min(0) });
const couponIdParam = z.object({ id: z.string().min(1) });
const listQuery = z.object({
  organizationId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  couponIdParam,
  listQuery,
};
