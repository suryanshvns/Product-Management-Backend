const { prisma } = require('../database/client');

const activityLogRepository = {
  findMany: async ({ page = 1, limit = 50, userId, entity, entityId, action, dateFrom, dateTo }) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.activityLog.count({ where }),
    ]);
    return { items, total, page, limit };
  },

  create: async (data) => {
    return prisma.activityLog.create({ data });
  },
};

module.exports = activityLogRepository;
