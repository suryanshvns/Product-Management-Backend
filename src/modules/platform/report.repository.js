const { prisma } = require('../../database/client');

const reportRepository = {
  salesReport: async ({ dateFrom, dateTo }) => {
    const where = { status: { not: 'cancelled' } };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: { include: { category: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    let totalRevenue = 0;
    const byCategory = {};
    const byProduct = {};

    for (const order of orders) {
      const orderTotal = Number(order.totalAmount || 0);
      totalRevenue += orderTotal;
      for (const item of order.items) {
        const amount = Number(item.totalPrice);
        const catName = item.product?.category?.name || 'Uncategorized';
        byCategory[catName] = (byCategory[catName] || 0) + amount;
        const prodName = item.product?.name || item.productId;
        byProduct[prodName] = (byProduct[prodName] || 0) + amount;
      }
    }

    return {
      totalRevenue,
      orderCount: orders.length,
      byCategory: Object.entries(byCategory).map(([name, revenue]) => ({ category: name, revenue })),
      byProduct: Object.entries(byProduct)
        .map(([name, revenue]) => ({ product: name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 20),
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    };
  },

  inventoryReport: async () => {
    const items = await prisma.inventory.findMany({
      include: { product: { select: { id: true, name: true, status: true } } },
    });
    const lowStock = items.filter((i) => i.quantity < i.lowStockThreshold);
    const outOfStock = items.filter((i) => i.quantity === 0);
    return {
      totalSkus: items.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      lowStockItems: lowStock.map((i) => ({
        productId: i.productId,
        productName: i.product?.name,
        quantity: i.quantity,
        threshold: i.lowStockThreshold,
      })),
      outOfStockItems: outOfStock.map((i) => ({ productId: i.productId, productName: i.product?.name })),
    };
  },
};

module.exports = reportRepository;
