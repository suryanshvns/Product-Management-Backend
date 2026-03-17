const { prisma } = require('../database/client');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const categoryRepository = {
  create: async (data) => {
    const slug = `${slugify(data.name)}-${Date.now().toString(36)}`;
    return prisma.category.create({
      data: { ...data, slug },
    });
  },

  findMany: async () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  },

  findById: async (id) => {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
  },

  update: async (id, data) => {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = `${slugify(data.name)}-${id}`;
    }
    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id) => {
    return prisma.category.delete({ where: { id } });
  },
};

module.exports = categoryRepository;
