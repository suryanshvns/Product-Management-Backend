const reviewRepository = require('./reviewRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const reviewService = {
  create: async (userId, data) => {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new NotFoundError('Product not found');
    const existing = await reviewRepository.findByProductAndUser(data.productId, userId);
    if (existing) throw new ValidationError('You have already reviewed this product');
    return reviewRepository.create({ productId: data.productId, userId, rating: data.rating, comment: data.comment ?? null });
  },
  getByProduct: async (productId, query) => reviewRepository.findManyByProduct(productId, query),
  update: async (userId, productId, data) => {
    const review = await reviewRepository.findByProductAndUser(productId, userId);
    if (!review) throw new NotFoundError('Review not found');
    return reviewRepository.update(productId, userId, data);
  },
  delete: async (userId, productId) => {
    const review = await reviewRepository.findByProductAndUser(productId, userId);
    if (!review) throw new NotFoundError('Review not found');
    return reviewRepository.delete(productId, userId);
  },
};

module.exports = reviewService;
