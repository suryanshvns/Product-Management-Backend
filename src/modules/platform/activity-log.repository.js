const { prisma } = require('../../database/client');

function formatLogItem(row) {
  const roles = row.user?.userRoles?.map((ur) => ur.role?.name).filter(Boolean) || [];
  const designation = roles.length ? roles.join(', ') : null;
  return {
    id: row.id,
    action: row.action,
    entity: row.entity,
    entityId: row.entityId,
    changeSummary: row.changeSummary,
    oldValues: row.oldValues,
    newValues: row.newValues,
    metadata: row.metadata,
    createdAt: row.createdAt,
    changedBy: row.user
      ? {
          id: row.user.id,
          name: row.user.name,
          email: row.user.email,
          designation: designation || undefined,
        }
      : null,
  };
}

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

    const [rows, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              userRoles: { include: { role: { select: { name: true } } } },
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);
    const items = rows.map(formatLogItem);
    return { items, total, page, limit };
  },

  create: async (data) => {
    return prisma.activityLog.create({ data });
  },
};

module.exports = activityLogRepository;
