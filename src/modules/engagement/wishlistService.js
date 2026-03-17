const wishlistRepository = require('./wishlistRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const wishlistService = {
  add: async (userId, productId) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError('Product not found');
    const existing = await wishlistRepository.has(userId, productId);
    if (existing) throw new ValidationError('Product already in wishlist');
    return wishlistRepository.add(userId, productId);
  },
  remove: async (userId, productId) => {
    const existing = await wishlistRepository.has(userId, productId);
    if (!existing) throw new NotFoundError('Wishlist item not found');
    return wishlistRepository.remove(userId, productId);
  },
  list: async (userId, query) => wishlistRepository.listByUser(userId, query),
};

module.exports = wishlistService;
