const { prisma } = require('../../database/client');

const relatedRepository = {
  add: async (productId, relatedProductId, relationType = 'related') => {
    if (productId === relatedProductId) return null;
    return prisma.productRelation.create({
      data: { productId, relatedProductId, relationType },
      include: {
        product: true,
        relatedProduct: { include: { category: true, images: true } },
      },
    });
  },
  remove: async (productId, relatedProductId) =>
    prisma.productRelation.delete({
      where: { productId_relatedProductId: { productId, relatedProductId } },
    }),
  listByProduct: async (productId, relationType) => {
    const where = { productId };
    if (relationType) where.relationType = relationType;
    return prisma.productRelation.findMany({
      where,
      include: { relatedProduct: { include: { category: true, images: true } } },
    });
  },
};

module.exports = relatedRepository;
