const { prisma } = require('../../database/client');

const variantRepository = {
  create: async (data) => prisma.productVariant.create({ data }),
  findById: async (id) =>
    prisma.productVariant.findUnique({
      where: { id },
      include: { product: true, batches: true },
    }),
  findBySku: async (sku) =>
    prisma.productVariant.findUnique({
      where: { sku },
      include: { product: true },
    }),
  findByProductId: async (productId) =>
    prisma.productVariant.findMany({
      where: { productId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    }),
  findMany: async ({ productId, sku, barcode, page = 1, limit = 20 }) => {
    const where = {};
    if (productId) where.productId = productId;
    if (sku) where.sku = { contains: sku, mode: 'insensitive' };
    if (barcode) where.barcode = { contains: barcode, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.productVariant.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) =>
    prisma.productVariant.update({
      where: { id },
      data,
      include: { product: true },
    }),
  updateQuantity: async (id, delta) => {
    const v = await prisma.productVariant.findUnique({ where: { id } });
    if (!v) return null;
    const quantity = Math.max(0, v.quantity + delta);
    return prisma.productVariant.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });
  },
  delete: async (id) => prisma.productVariant.delete({ where: { id } }),
};

module.exports = variantRepository;
