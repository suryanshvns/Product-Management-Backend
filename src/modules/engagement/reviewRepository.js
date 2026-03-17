const { prisma } = require('../../database/client');

const reviewRepository = {
  create: async (data) =>
    prisma.review.create({
      data,
      include: { product: true, user: { select: { id: true, name: true, email: true } } },
    }),
  findByProductAndUser: async (productId, userId) =>
    prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
      include: { user: { select: { id: true, name: true } } },
    }),
  findManyByProduct: async (productId, { page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;
    const [items, total, agg] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        skip,
        take: Math.min(limit, 100),
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId } }),
      prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true }),
    ]);
    return { items, total, page, limit, averageRating: agg._avg.rating, totalReviews: agg._count };
  },
  update: async (productId, userId, data) =>
    prisma.review.update({
      where: { productId_userId: { productId, userId } },
      data,
      include: { product: true, user: { select: { id: true, name: true } } },
    }),
  delete: async (productId, userId) =>
    prisma.review.delete({ where: { productId_userId: { productId, userId } } }),
};

module.exports = reviewRepository;
