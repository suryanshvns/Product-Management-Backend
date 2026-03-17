const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const webhookService = require('./webhookService');
const { prisma } = require('../database/client');
const { NotFoundError, ValidationError } = require('../utils/errors');

const orderService = {
  createOrder: async (userId, organizationId, items) => {
    if (!items?.length) throw new ValidationError('Order must have at least one item');
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      include: { inventory: true },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) throw new ValidationError(`Product not found: ${item.productId}`);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const inv = product.inventory;
      const available = inv ? inv.quantity : 0;
      if (available < qty) throw new ValidationError(`Insufficient stock for product ${product.name}`);
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const lineTotal = unitPrice * qty;
      totalAmount += lineTotal;
      orderItems.push({ productId: product.id, quantity: qty, unitPrice });
    }

    const order = await orderRepository.create({
      userId,
      organizationId,
      status: 'pending',
      totalAmount,
      items: orderItems,
    });

    for (const item of orderItems) {
      const product = productMap[item.productId];
      const inv = product.inventory;
      if (inv) {
        await prisma.inventory.update({
          where: { productId: product.id },
          data: { quantity: inv.quantity - item.quantity },
        });
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
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(toStatus)) throw new ValidationError('Invalid status');
    return orderRepository.updateStatus(id, order.status, toStatus);
  },
};

module.exports = orderService;
