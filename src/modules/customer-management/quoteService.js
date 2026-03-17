const quoteRepository = require('./quoteRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const quoteService = {
  create: async (data) => {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) throw new NotFoundError('Customer not found');
    return quoteRepository.create(data);
  },
  getById: async (id) => {
    const q = await quoteRepository.findById(id);
    if (!q) throw new NotFoundError('Quote not found');
    return q;
  },
  list: async (filters) => quoteRepository.findMany(filters),
  update: async (id, data) => {
    const q = await quoteRepository.findById(id);
    if (!q) throw new NotFoundError('Quote not found');
    return quoteRepository.update(id, data);
  },
  addLine: async (quoteId, line) => {
    const quote = await quoteRepository.findById(quoteId);
    if (!quote) throw new NotFoundError('Quote not found');
    if (quote.status !== 'draft') throw new ValidationError('Can only add lines to draft quote');
    const variant = await prisma.productVariant.findUnique({ where: { id: line.productVariantId } });
    if (!variant) throw new NotFoundError('Variant not found');
    return quoteRepository.addLine(quoteId, {
      productVariantId: line.productVariantId,
      quantity: line.quantity,
      unitPrice: line.unitPrice ?? Number(variant.priceOverride || variant.product?.price || 0),
    });
  },
  removeLine: async (quoteId, lineId) => {
    const quote = await quoteRepository.findById(quoteId);
    if (!quote) throw new NotFoundError('Quote not found');
    if (quote.status !== 'draft') throw new ValidationError('Can only remove lines from draft quote');
    await quoteRepository.removeLine(lineId);
    return quoteRepository.findById(quoteId);
  },
  convertToOrder: async (quoteId, userId, organizationId) => {
    const quote = await quoteRepository.findById(quoteId);
    if (!quote) throw new NotFoundError('Quote not found');
    if (quote.status !== 'accepted') throw new ValidationError('Only accepted quotes can be converted');
    const items = quote.lines.map((l) => ({
      productId: l.variant.productId,
      productVariantId: l.variant.id,
      quantity: l.quantity,
      unitPrice: Number(l.unitPrice),
    }));
    const totalAmount = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const order = await prisma.order.create({
      data: {
        userId: userId || quote.customer.userId,
        organizationId: organizationId || quote.organizationId,
        customerId: quote.customerId,
        status: 'pending',
        totalAmount,
        subtotalAmount: totalAmount,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            productVariantId: i.productVariantId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.quantity * i.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
    await quoteRepository.update(quoteId, { status: 'converted', convertedOrderId: order.id });
    return order;
  },
};

module.exports = quoteService;
