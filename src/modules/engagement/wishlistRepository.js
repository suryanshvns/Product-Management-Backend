const { prisma } = require('../../database/client');

const wishlistRepository = {
  add: async (userId, productId) =>
    prisma.wishlistItem.create({
      data: { userId, productId },
      include: { product: { include: { category: true, images: true } } },
    }),
  remove: async (userId, productId) =>
    prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } }),
  listByUser: async (userId, { page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userId },
        skip,
        take: Math.min(limit, 100),
        include: { product: { include: { category: true, images: true, inventory: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.wishlistItem.count({ where: { userId } }),
    ]);
    return { items, total, page, limit };
  },
  has: async (userId, productId) =>
    prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } }),
};

module.exports = wishlistRepository;
