const couponRepository = require('./couponRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const couponService = {
  create: async (data) => {
    const existing = await couponRepository.findByCode(data.code);
    if (existing) throw new ValidationError('Coupon code already exists');
    return couponRepository.create({
      code: data.code.toUpperCase().replace(/\s/g, ''),
      discountType: data.discountType,
      value: data.value,
      minOrderAmount: data.minOrderAmount ?? null,
      validFrom: data.validFrom ?? null,
      validUntil: data.validUntil ?? null,
      maxUses: data.maxUses ?? null,
      isActive: data.isActive !== false,
      organizationId: data.organizationId ?? null,
    });
  },

  getById: async (id) => {
    const c = await couponRepository.findById(id);
    if (!c) throw new NotFoundError('Coupon not found');
    return c;
  },

  list: async (filters) => couponRepository.findMany(filters),

  update: async (id, data) => {
    const c = await couponRepository.findById(id);
    if (!c) throw new NotFoundError('Coupon not found');
    return couponRepository.update(id, data);
  },

  validate: async (code, orderAmount) => {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) throw new NotFoundError('Coupon not found');
    if (!coupon.isActive) throw new ValidationError('Coupon is not active');
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) throw new ValidationError('Coupon not yet valid');
    if (coupon.validUntil && now > coupon.validUntil) throw new ValidationError('Coupon has expired');
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) throw new ValidationError('Coupon usage limit reached');
    const minOrder = Number(coupon.minOrderAmount ?? 0);
    if (orderAmount < minOrder) throw new ValidationError(`Minimum order amount is ${minOrder}`);
    let discount = 0;
    if (coupon.discountType === 'PERCENT') {
      discount = Math.min(orderAmount * (Number(coupon.value) / 100), orderAmount);
    } else {
      discount = Math.min(Number(coupon.value), orderAmount);
    }
    return { coupon, discountAmount: Math.round(discount * 100) / 100 };
  },

  applyAndIncrement: async (code, orderAmount) => {
    const { coupon, discountAmount } = await couponService.validate(code, orderAmount);
    await couponRepository.incrementUsed(coupon.id);
    return { couponId: coupon.id, discountAmount };
  },
};

module.exports = couponService;
