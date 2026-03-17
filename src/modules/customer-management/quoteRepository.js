const { prisma } = require('../../database/client');

const quoteRepository = {
  create: async (data) =>
    prisma.quote.create({
      data: {
        customerId: data.customerId,
        organizationId: data.organizationId ?? null,
        status: data.status || 'draft',
        validUntil: data.validUntil ?? null,
      },
      include: { customer: true, lines: true },
    }),
  findById: async (id) =>
    prisma.quote.findUnique({
      where: { id },
      include: { customer: true, lines: { include: { variant: { include: { product: true } } } } },
    }),
  findMany: async ({ customerId, status, organizationId, page = 1, limit = 20 }) => {
    const where = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;
    if (organizationId) where.organizationId = organizationId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { customer: true, _count: { select: { lines: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quote.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) =>
    prisma.quote.update({
      where: { id },
      data,
      include: { customer: true, lines: true },
    }),
  addLine: async (quoteId, line) =>
    prisma.quoteLineItem.create({
      data: { quoteId, productVariantId: line.productVariantId, quantity: line.quantity, unitPrice: line.unitPrice },
    }),
  removeLine: async (lineId) => prisma.quoteLineItem.delete({ where: { id: lineId } }),
  getLines: async (quoteId) =>
    prisma.quoteLineItem.findMany({
      where: { quoteId },
      include: { variant: { include: { product: true } } },
    }),
};

module.exports = quoteRepository;
