const crypto = require('crypto');
const { prisma } = require('../database/client');

const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');

const apiKeyRepository = {
  create: async (name, userId, organizationId) => {
    const rawKey = `pm_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = hashKey(rawKey);
    await prisma.apiKey.create({
      data: { name, keyHash, userId: userId || null, organizationId: organizationId || null },
    });
    return { rawKey, keyHash };
  },

  findByHash: async (keyHash) => {
    return prisma.apiKey.findFirst({
      where: { keyHash },
    });
  },

  findMany: async (userId, organizationId) => {
    const where = {};
    if (userId) where.userId = userId;
    if (organizationId) where.organizationId = organizationId;
    return prisma.apiKey.findMany({
      where,
      select: { id: true, name: true, lastUsedAt: true, createdAt: true },
    });
  },

  delete: async (id) => {
    return prisma.apiKey.delete({ where: { id } });
  },
};

module.exports = { apiKeyRepository, hashKey };
