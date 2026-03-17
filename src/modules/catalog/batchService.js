const batchRepository = require('./batchRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const batchService = {
  create: async (data) => {
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.productVariantId },
    });
    if (!variant) throw new NotFoundError('Product variant not found');
    const batch = await batchRepository.create({
      productVariantId: data.productVariantId,
      batchNumber: data.batchNumber,
      expiryDate: data.expiryDate ?? null,
      quantity: data.quantity ?? 0,
    });
    await prisma.productVariant.update({
      where: { id: data.productVariantId },
      data: { quantity: variant.quantity + (data.quantity ?? 0) },
    });
    return batch;
  },

  getById: async (id) => {
    const batch = await batchRepository.findById(id);
    if (!batch) throw new NotFoundError('Batch not found');
    return batch;
  },

  list: async (filters) => batchRepository.findMany(filters),

  update: async (id, data) => {
    const batch = await batchRepository.findById(id);
    if (!batch) throw new NotFoundError('Batch not found');
    if (data.quantity != null && data.quantity !== batch.quantity) {
      const delta = data.quantity - batch.quantity;
      await prisma.productVariant.update({
        where: { id: batch.productVariantId },
        data: { quantity: { increment: delta } },
      });
    }
    return batchRepository.update(id, data);
  },

  delete: async (id) => {
    const batch = await batchRepository.findById(id);
    if (!batch) throw new NotFoundError('Batch not found');
    await prisma.productVariant.update({
      where: { id: batch.productVariantId },
      data: { quantity: { decrement: batch.quantity } },
    });
    return batchRepository.delete(id);
  },
};

module.exports = batchService;
