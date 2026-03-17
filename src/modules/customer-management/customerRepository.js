const { prisma } = require('../../database/client');

const customerRepository = {
  create: async (data) =>
    prisma.customer.create({
      data,
      include: { group: true, addresses: true },
    }),
  findById: async (id) =>
    prisma.customer.findUnique({
      where: { id },
      include: { group: true, addresses: true },
    }),
  findMany: async ({ organizationId, customerGroupId, page = 1, limit = 20 }) => {
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    if (customerGroupId) where.customerGroupId = customerGroupId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { group: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) =>
    prisma.customer.update({
      where: { id },
      data,
      include: { group: true, addresses: true },
    }),
  delete: async (id) => prisma.customer.delete({ where: { id } }),
};

module.exports = customerRepository;
