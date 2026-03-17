const { prisma } = require('../../database/client');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const tagRepository = {
  create: async (data) => {
    const slug = data.slug || slugify(data.name);
    return prisma.tag.create({ data: { ...data, slug } });
  },
  findById: async (id) =>
    prisma.tag.findUnique({
      where: { id },
      include: { products: { include: { product: true } } },
    }),
  findBySlug: async (slug) => prisma.tag.findUnique({ where: { slug } }),
  findMany: async ({ slug, name, page = 1, limit = 50 }) => {
    const where = {};
    if (slug) where.slug = { contains: slug, mode: 'insensitive' };
    if (name) where.name = { contains: name, mode: 'insensitive' };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.tag.count({ where }),
    ]);
    return { items, total, page, limit };
  },
  update: async (id, data) => {
    if (data.name && !data.slug) data.slug = slugify(data.name);
    return prisma.tag.update({ where: { id }, data });
  },
  delete: async (id) => prisma.tag.delete({ where: { id } }),
  addToProduct: async (productId, tagId) =>
    prisma.productTag.create({ data: { productId, tagId } }),
  removeFromProduct: async (productId, tagId) =>
    prisma.productTag.delete({ where: { productId_tagId: { productId, tagId } } }),
  setProductTags: async (productId, tagIds) => {
    await prisma.productTag.deleteMany({ where: { productId } });
    if (tagIds.length)
      await prisma.productTag.createMany({
        data: tagIds.map((tagId) => ({ productId, tagId })),
      });
    return prisma.product.findUnique({
      where: { id: productId },
      include: { tags: { include: { tag: true } } },
    });
  },
};

module.exports = tagRepository;
