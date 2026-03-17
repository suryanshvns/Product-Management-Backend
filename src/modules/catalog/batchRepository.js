const { prisma } = require('../../database/client');

const batchRepository = {
  create: async (data) =>
    prisma.inventoryBatch.create({
      data,
      include: { variant: { include: { product: true } } },
    }),
  findById: async (id) =>
    prisma.inventoryBatch.findUnique({
      where: { id },
      include: { variant: { include: { product: true } } },
    }),
  findByVariantId: async (productVariantId) =>
    prisma.inventoryBatch.findMany({
      where: { productVariantId },
      include: { variant: true },
      orderBy: { expiryDate: 'asc' },
    }),
  findMany: async ({ productVariantId, expiryBefore, page = 1, limit = 20 }) => {
    const where = {};
    if (productVariantId) where.productVariantId = productVariantId;
    if (expiryBefore) where.expiryDate = { lte: new Date(expiryBefore) };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.inventoryBatch.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { variant: { include: { product: true } } },
        orderBy: { expiryDate: 'asc' },
      }),
      prisma.inventoryBatch.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) =>
    prisma.inventoryBatch.update({
      where: { id },
      data,
      include: { variant: true },
    }),
  delete: async (id) => prisma.inventoryBatch.delete({ where: { id } }),
};

module.exports = batchRepository;
