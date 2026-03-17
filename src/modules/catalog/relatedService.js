const relatedRepository = require('./relatedRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const relatedService = {
  add: async (productId, relatedProductId, relationType) => {
    const [p, r] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.product.findUnique({ where: { id: relatedProductId } }),
    ]);
    if (!p) throw new NotFoundError('Product not found');
    if (!r) throw new NotFoundError('Related product not found');
    try {
      return await relatedRepository.add(productId, relatedProductId, relationType || 'related');
    } catch (e) {
      if (e.code === 'P2002') throw new ValidationError('This relation already exists');
      throw e;
    }
  },

  remove: async (productId, relatedProductId) => {
    try {
      await relatedRepository.remove(productId, relatedProductId);
      return { success: true };
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundError('Relation not found');
      throw e;
    }
  },

  list: async (productId, relationType) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError('Product not found');
    const relations = await relatedRepository.listByProduct(productId, relationType);
    return relations.map((r) => r.relatedProduct);
  },
};

module.exports = relatedService;
