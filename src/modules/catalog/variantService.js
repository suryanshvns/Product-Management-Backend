const variantRepository = require('./variantRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const variantService = {
  create: async (data) => {
    const existing = await variantRepository.findBySku(data.sku);
    if (existing) throw new ValidationError('Variant with this SKU already exists');
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new NotFoundError('Product not found');
    return variantRepository.create({
      productId: data.productId,
      sku: data.sku,
      barcode: data.barcode ?? null,
      name: data.name ?? null,
      attributes: data.attributes ?? undefined,
      quantity: data.quantity ?? 0,
      reorderPoint: data.reorderPoint ?? 5,
      reorderQty: data.reorderQty ?? 20,
      priceOverride: data.priceOverride != null ? data.priceOverride : undefined,
    });
  },

  getById: async (id) => {
    const v = await variantRepository.findById(id);
    if (!v) throw new NotFoundError('Variant not found');
    return v;
  },

  list: async (filters) => variantRepository.findMany(filters),

  update: async (id, data) => {
    const v = await variantRepository.findById(id);
    if (!v) throw new NotFoundError('Variant not found');
    if (data.sku && data.sku !== v.sku) {
      const existing = await variantRepository.findBySku(data.sku);
      if (existing) throw new ValidationError('Variant with this SKU already exists');
    }
    return variantRepository.update(id, data);
  },

  updateStock: async (id, delta) => {
    const v = await variantRepository.updateQuantity(id, delta);
    if (!v) throw new NotFoundError('Variant not found');
    return v;
  },

  delete: async (id) => {
    const v = await variantRepository.findById(id);
    if (!v) throw new NotFoundError('Variant not found');
    return variantRepository.delete(id);
  },

  reorderSuggestions: async (organizationId) => {
    const variants = await prisma.productVariant.findMany({
      where: { product: { organizationId: organizationId ?? undefined } },
      include: { product: true },
    });
    return variants
      .filter((v) => v.quantity <= v.reorderPoint)
      .map((v) => ({
        variantId: v.id,
        productId: v.productId,
        sku: v.sku,
        currentStock: v.quantity,
        reorderPoint: v.reorderPoint,
        suggestedReorderQty: v.reorderQty,
      }));
  },
};

module.exports = variantService;
