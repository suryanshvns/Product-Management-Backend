const { prisma } = require('../../database/client');

const priceListRepository = {
  create: async (data) =>
    prisma.priceList.create({
      data: { name: data.name, organizationId: data.organizationId ?? null, customerGroupId: data.customerGroupId ?? null, isDefault: data.isDefault ?? false },
      include: { group: true },
    }),
  findById: async (id) =>
    prisma.priceList.findUnique({
      where: { id },
      include: { items: { include: { variant: true } }, group: true },
    }),
  findMany: async ({ organizationId, page = 1, limit = 20 }) => {
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.priceList.findMany({ where, skip, take: Math.min(limit, 100), include: { group: true }, orderBy: { name: 'asc' } }),
      prisma.priceList.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) => prisma.priceList.update({ where: { id }, data, include: { group: true } }),
  delete: async (id) => prisma.priceList.delete({ where: { id } }),
  setItem: async (priceListId, productVariantId, price) =>
    prisma.priceListItem.upsert({
      where: { priceListId_productVariantId: { priceListId, productVariantId } },
      create: { priceListId, productVariantId, price },
      update: { price },
    }),
};

module.exports = priceListRepository;
