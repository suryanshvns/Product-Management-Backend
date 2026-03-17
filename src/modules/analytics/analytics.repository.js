const { prisma } = require('../../database/client');

const analyticsRepository = {
  getOverview: async () => {
    const [productCount, categoryCount, inventoryRows] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.inventory.findMany({ select: { quantity: true, lowStockThreshold: true } }),
    ]);

    const lowStockCount = inventoryRows.filter(
      (row) => row.quantity < row.lowStockThreshold
    ).length;

    return {
      productCount,
      categoryCount,
      lowStockCount,
    };
  },

  getProductsByCategory: async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
        products: {
          select: {
            id: true,
            name: true,
            status: true,
            images: { orderBy: { sortOrder: 'asc' }, select: { id: true, url: true, alt: true, sortOrder: true } },
          },
        },
      },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
      products: c.products,
    }));
  },

  getTopProducts: async (limit = 10) => {
    const take = Math.min(limit || 10, 100);
    const products = await prisma.product.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        inventory: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return products;
  },

  getInventoryStatus: async () => {
    const items = await prisma.inventory.findMany({
      include: {
        product: { select: { id: true, name: true, status: true } },
      },
    });
    const lowStock = items.filter((i) => i.quantity < i.lowStockThreshold);
    const inStock = items.filter((i) => i.quantity >= i.lowStockThreshold);
    return {
      total: items.length,
      lowStock: lowStock.length,
      inStock: inStock.length,
      lowStockItems: lowStock.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        quantity: i.quantity,
        lowStockThreshold: i.lowStockThreshold,
      })),
      summary: {
        totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
      },
    };
  },
};

module.exports = analyticsRepository;
