const { prisma } = require('../database/client');

const norm = (v) => (v || '');

const settingRepository = {
  get: async (scope, scopeId, key) => {
    const record = await prisma.setting.findFirst({
      where: { scope, scopeId: norm(scopeId), key },
    });
    return record?.value ?? null;
  },

  set: async (scope, scopeId, organizationId, key, value) => {
    const sid = norm(scopeId);
    const existing = await prisma.setting.findFirst({
      where: { scope, scopeId: sid, key },
    });
    if (existing) {
      return prisma.setting.update({
        where: { id: existing.id },
        data: { value, updatedAt: new Date() },
      });
    }
    return prisma.setting.create({
      data: { scope, scopeId: sid, organizationId: organizationId || null, key, value },
    });
  },

  list: async (scope, scopeId) => {
    const where = { scope, scopeId: norm(scopeId) };
    const list = await prisma.setting.findMany({ where });
    return Object.fromEntries(list.map((s) => [s.key, s.value]));
  },
};

module.exports = settingRepository;
