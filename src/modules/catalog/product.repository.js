const { prisma } = require('../../database/client');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const productRepository = {
  create: async (productData) => {
    const baseSlug = slugify(productData.name);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    return prisma.product.create({
      data: { ...productData, slug },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  findById: async (id) => {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  findMany: async ({ page = 1, limit = 20, search, categoryId }) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
        include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total, page, limit };
  },

  update: async (id, productData) => {
    return prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  delete: async (id) => {
    return prisma.product.delete({
      where: { id },
      include: { category: true },
    });
  },

  deleteMany: async (ids) => {
    const result = await prisma.product.deleteMany({ where: { id: { in: ids } } });
    return result;
  },

  updateStatus: async (id, status) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    const fromStatus = product.status;
    await prisma.$transaction([
      prisma.product.update({ where: { id }, data: { status } }),
      prisma.productStatusHistory.create({
        data: { productId: id, fromStatus, toStatus: status },
      }),
    ]);
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  upsertInventory: async (productId, quantity, lowStockThreshold) => {
    return prisma.inventory.upsert({
      where: { productId },
      create: { productId, quantity, lowStockThreshold: lowStockThreshold ?? 10 },
      update: { quantity, ...(lowStockThreshold != null && { lowStockThreshold }) },
    });
  },

  updateManyStatus: async (ids, status) => {
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const historyRows = products.map((p) => ({
      productId: p.id,
      fromStatus: p.status,
      toStatus: status,
    }));
    await prisma.$transaction([
      prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } }),
      prisma.productStatusHistory.createMany({ data: historyRows }),
    ]);
    return prisma.product.findMany({
      where: { id: { in: ids } },
      include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  createImage: async (productId, url, alt, sortOrder) => {
    return prisma.productImage.create({
      data: { productId, url, alt: alt || null, sortOrder: sortOrder ?? 0 },
    });
  },

  deleteImage: async (imageId) => {
    return prisma.productImage.delete({ where: { id: imageId } });
  },

  getImage: async (imageId) => {
    return prisma.productImage.findUnique({ where: { id: imageId } });
  },
};

module.exports = productRepository;
