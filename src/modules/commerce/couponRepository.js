const { prisma } = require('../../database/client');

const couponRepository = {
  create: async (data) => prisma.coupon.create({ data }),
  findByCode: async (code) =>
    prisma.coupon.findFirst({
      where: { code: { equals: code, mode: 'insensitive' } },
    }),
  findById: async (id) => prisma.coupon.findUnique({ where: { id } }),
  findMany: async ({ organizationId, isActive, page = 1, limit = 20 }) => {
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    if (isActive != null) where.isActive = isActive;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.coupon.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) => prisma.coupon.update({ where: { id }, data }),
  incrementUsed: async (id) =>
    prisma.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    }),
};

module.exports = couponRepository;
