const productRepository = require('./product.repository');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const productService = {
  createProduct: async (productData) => {
    const product = await productRepository.create(productData);
    if (!product) throw new ValidationError('Failed to create product');
    return product;
  },

  getProductById: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  },

  listProducts: async ({ page, limit, search, categoryId }) => {
    return productRepository.findMany({
      page: page || 1,
      limit: limit || 20,
      search,
      categoryId,
    });
  },

  updateProduct: async (id, productData) => {
    const product = await productRepository.update(id, productData);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  },

  deleteProduct: async (id) => {
    try {
      const product = await productRepository.delete(id);
      return product;
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Product not found');
      throw err;
    }
  },

  updateProductStatus: async (id, status) => {
    const product = await productRepository.updateStatus(id, status);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  },

  updateProductStock: async (id, quantity, lowStockThreshold) => {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    await productRepository.upsertInventory(id, quantity, lowStockThreshold);
    return productRepository.findById(id);
  },

  bulkDelete: async (ids) => {
    const result = await productRepository.deleteMany(ids);
    return { deletedCount: result.count };
  },

  bulkUpdateStatus: async (ids, status) => {
    const products = await productRepository.updateManyStatus(ids, status);
    return { updatedCount: products.length, products };
  },

  addImages: async (productId, files, alt) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    const existingCount = (product.images && product.images.length) || 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const url = `/uploads/products/${f.filename}`;
      await productRepository.createImage(
        productId,
        url,
        alt || f.originalname,
        existingCount + i
      );
    }
    return productRepository.findById(productId);
  },

  deleteImage: async (productId, imageId) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    const image = await productRepository.getImage(imageId);
    if (!image || image.productId !== productId) throw new NotFoundError('Image not found');
    await productRepository.deleteImage(imageId);
    return productRepository.findById(productId);
  },
};

module.exports = productService;
