const { prisma } = require('../database/client');

const alertRuleRepository = {
  create: async (data) => {
    return prisma.alertRule.create({ data });
  },

  findMany: async ({ userId, organizationId, isActive }) => {
    const where = {};
    if (userId) where.userId = userId;
    if (organizationId) where.organizationId = organizationId;
    if (isActive !== undefined) where.isActive = isActive;
    return prisma.alertRule.findMany({ where, orderBy: { createdAt: 'desc' } });
  },

  findById: async (id) => {
    return prisma.alertRule.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.alertRule.update({ where: { id }, data });
  },

  delete: async (id) => {
    return prisma.alertRule.delete({ where: { id } });
  },
};

module.exports = alertRuleRepository;
