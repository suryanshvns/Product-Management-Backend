const { prisma } = require('../../database/client');

function buildProductWhere(query) {
  const where = { deletedAt: null };
  const q = (query.q || query.search || '').trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
      { barcode: { contains: q, mode: 'insensitive' } },
      { variants: { some: { sku: { contains: q, mode: 'insensitive' } } } },
      { variants: { some: { barcode: { contains: q, mode: 'insensitive' } } } },
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.status) where.status = query.status;
  if (query.minPrice != null || query.maxPrice != null) {
    where.price = {};
    if (query.minPrice != null) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice != null) where.price.lte = parseFloat(query.maxPrice);
  }
  if (query.tagIds && query.tagIds.length) {
    where.tags = { some: { tagId: { in: query.tagIds } } };
  }
  if (query.tagSlug) {
    where.tags = { some: { tag: { slug: query.tagSlug } } };
  }
  if (query.inStock === 'true' || query.inStock === true) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { inventory: { quantity: { gt: 0 } } },
          { variants: { some: { quantity: { gt: 0 } } } },
        ],
      },
    ];
  }
  if (query.sku) {
    const skuCond = {
      OR: [
        { sku: { contains: query.sku, mode: 'insensitive' } },
        { variants: { some: { sku: { contains: query.sku, mode: 'insensitive' } } } },
      ],
    };
    where.AND = where.AND ? [...where.AND, skuCond] : [skuCond];
  }
  if (query.barcode) {
    const barcodeCond = {
      OR: [
        { barcode: { contains: query.barcode, mode: 'insensitive' } },
        { variants: { some: { barcode: { contains: query.barcode, mode: 'insensitive' } } } },
      ],
    };
    where.AND = where.AND ? [...where.AND, barcodeCond] : [barcodeCond];
  }
  return where;
}

const searchService = {
  products: async ({ page = 1, limit = 20, ...query }) => {
    const where = buildProductWhere(query);
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          inventory: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total, page, limit };
  },
};

module.exports = searchService;
