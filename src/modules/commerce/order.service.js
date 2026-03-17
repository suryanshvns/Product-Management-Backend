const orderRepository = require('./order.repository');
const webhookService = require('../platform/webhook.service');
const couponService = require('./couponService');
const { prisma } = require('../../database/client');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const orderService = {
  createOrder: async (userId, organizationId, body) => {
    const items = body.items || [];
    if (!items.length) throw new ValidationError('Order must have at least one item');

    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      include: { inventory: true, variants: true },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let subtotalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) throw new ValidationError(`Product not found: ${item.productId}`);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      let available = 0;
      let productVariantId = item.productVariantId || null;
      if (productVariantId) {
        const variant = product.variants?.find((v) => v.id === productVariantId);
        if (!variant) throw new ValidationError(`Variant not found: ${productVariantId}`);
        available = variant.quantity;
        if (available < qty) throw new ValidationError(`Insufficient stock for variant ${variant.sku}`);
      } else {
        const inv = product.inventory;
        available = inv ? inv.quantity : 0;
        if (available < qty) throw new ValidationError(`Insufficient stock for product ${product.name}`);
      }
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const lineTotal = unitPrice * qty;
      subtotalAmount += lineTotal;
      orderItems.push({ productId: product.id, productVariantId, quantity: qty, unitPrice });
    }

    let discountAmount = 0;
    let couponId = null;
    if (body.couponCode && body.couponCode.trim()) {
      try {
        const result = await couponService.applyAndIncrement(body.couponCode.trim(), subtotalAmount);
        discountAmount = result.discountAmount;
        couponId = result.couponId;
      } catch (e) {
        throw new ValidationError(e.message || 'Invalid coupon');
      }
    }
    const totalAmount = Math.max(0, subtotalAmount - discountAmount);

    const order = await orderRepository.create({
      userId,
      organizationId: organizationId || body.organizationId,
      customerId: body.customerId || null,
      status: 'pending',
      subtotalAmount,
      discountAmount: discountAmount || null,
      couponId,
      totalAmount,
      shippingAddress: body.shippingAddress ?? undefined,
      customerNote: body.customerNote ?? null,
      internalNote: body.internalNote ?? null,
      items: orderItems,
    });

    for (const item of orderItems) {
      const product = productMap[item.productId];
      if (item.productVariantId) {
        await prisma.productVariant.update({
          where: { id: item.productVariantId },
          data: { quantity: { decrement: item.quantity } },
        });
      } else {
        const inv = product.inventory;
        if (inv) {
          await prisma.inventory.update({
            where: { productId: product.id },
            data: { quantity: inv.quantity - item.quantity },
          });
        }
      }
    }

    webhookService.fire('order.created', { orderId: order.id, status: order.status, totalAmount: order.totalAmount }).catch(() => {});
    return order;
  },

  getOrderById: async (id) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  },

  listOrders: async (filters) => {
    return orderRepository.findMany(filters);
  },

  updateOrderStatus: async (id, toStatus) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(toStatus)) throw new ValidationError('Invalid status');
    return orderRepository.updateStatus(id, order.status, toStatus);
  },
};

module.exports = orderService;
