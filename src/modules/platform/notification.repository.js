const { prisma } = require('../../database/client');

const notificationRepository = {
  findManyByUserId: async (userId, { page = 1, limit = 20, unreadOnly }) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (unreadOnly) where.read = false;

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);
    return { items, total, page, limit, unreadCount };
  },

  markAsRead: async (id, userId) => {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  },

  markAllAsRead: async (userId) => {
    return prisma.notification.updateMany({
      where: { userId },
      data: { read: true },
    });
  },
};

module.exports = notificationRepository;
