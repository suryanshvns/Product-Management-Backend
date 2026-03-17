const { prisma } = require('../database/client');

const orderRepository = {
  create: async (data) => {
    return prisma.order.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId || null,
        status: data.status || 'pending',
        totalAmount: data.totalAmount ?? null,
        items: data.items?.length
          ? {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice * item.quantity,
              })),
            }
          : undefined,
      },
      include: { items: { include: { product: true } } },
    });
  },

  findById: async (id) => {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, statusHistory: true },
    });
  },

  findMany: async ({ page = 1, limit = 20, status, userId, organizationId }) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (organizationId) where.organizationId = organizationId;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.count({ where }),
    ]);
    return { items, total, page, limit };
  },

  updateStatus: async (id, fromStatus, toStatus) => {
    await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status: toStatus } }),
      prisma.orderStatusHistory.create({
        data: { orderId: id, fromStatus, toStatus },
      }),
    ]);
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, statusHistory: true },
    });
  },
};

module.exports = orderRepository;
