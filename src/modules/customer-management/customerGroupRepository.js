const { prisma } = require('../../database/client');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const customerGroupRepository = {
  create: async (data) => {
    const slug = data.slug || slugify(data.name);
    return prisma.customerGroup.create({ data: { ...data, slug }, include: { _count: { select: { customers: true } } } });
  },
  findById: async (id) =>
    prisma.customerGroup.findUnique({
      where: { id },
      include: { customers: true },
    }),
  findBySlug: async (slug) => prisma.customerGroup.findUnique({ where: { slug } }),
  findMany: async ({ organizationId, page = 1, limit = 20 }) => {
    const where = {};
    if (organizationId) where.organizationId = organizationId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.customerGroup.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { _count: { select: { customers: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.customerGroup.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) => {
    if (data.name && !data.slug) data.slug = slugify(data.name);
    return prisma.customerGroup.update({ where: { id }, data });
  },
  delete: async (id) => prisma.customerGroup.delete({ where: { id } }),
};

module.exports = customerGroupRepository;
