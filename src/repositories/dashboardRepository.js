const { prisma } = require('../database/client');

const dashboardRepository = {
  getSummary: async () => {
    const [
      productCount,
      categoryCount,
      orderCount,
      pendingOrders,
      lowStockCount,
      recentOrders,
      recentActivity,
    ] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.inventory.findMany().then((rows) => rows.filter((r) => r.quantity < r.lowStockThreshold).length),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 2 } },
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
    ]);

    return {
      productCount,
      categoryCount,
      orderCount,
      pendingOrders,
      lowStockCount,
      recentOrders,
      recentActivity,
    };
  },
};

module.exports = dashboardRepository;
