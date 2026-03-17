const { prisma } = require('../database/client');

const webhookRepository = {
  create: async (data) => {
    return prisma.webhookEndpoint.create({ data });
  },

  findMany: async (userId, organizationId) => {
    const where = {};
    if (userId) where.userId = userId;
    if (organizationId) where.organizationId = organizationId;
    return prisma.webhookEndpoint.findMany({ where, orderBy: { createdAt: 'desc' } });
  },

  findById: async (id) => {
    return prisma.webhookEndpoint.findUnique({ where: { id } });
  },

  findActiveByEvent: async (event) => {
    const all = await prisma.webhookEndpoint.findMany({
      where: { isActive: true },
    });
    return all.filter((w) => Array.isArray(w.events) && w.events.includes(event));
  },

  update: async (id, data) => {
    return prisma.webhookEndpoint.update({ where: { id }, data });
  },

  delete: async (id) => {
    return prisma.webhookEndpoint.delete({ where: { id } });
  },

  createDelivery: async (data) => {
    return prisma.webhookDelivery.create({ data });
  },
};

module.exports = webhookRepository;
