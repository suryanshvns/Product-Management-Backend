const { prisma } = require('../../database/client');

const invoiceRepository = {
  create: async (data) =>
    prisma.invoice.create({
      data,
      include: { order: { include: { items: { include: { product: true } }, user: true, customer: true } } },
    }),
  findByOrderId: async (orderId) =>
    prisma.invoice.findUnique({
      where: { orderId },
      include: { order: { include: { items: { include: { product: true, variant: true } }, user: true, customer: true } } },
    }),
  findByInvoiceNumber: async (invoiceNumber) =>
    prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: { order: true },
    }),
  findMany: async ({ page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: Math.min(limit, 100),
        orderBy: { createdAt: 'desc' },
        include: { order: { select: { id: true, status: true, totalAmount: true } } },
      }),
      prisma.invoice.count(),
    ]);
    return { items, total, page, limit };
  },
  getOrCreateCounter: async (organizationId) => {
    let orgId = organizationId;
    if (!orgId) {
      const org = await prisma.organization.findFirst();
      orgId = org?.id;
    }
    if (!orgId) throw new Error('No organization found for invoice counter');
    let counter = await prisma.invoiceCounter.findUnique({
      where: { organizationId: orgId },
    });
    if (!counter) {
      counter = await prisma.invoiceCounter.create({
        data: { organizationId: orgId, nextNumber: 1 },
      });
    }
    return counter;
  },
  incrementCounter: async (organizationId) => {
    let orgId = organizationId;
    if (!orgId) {
      const c = await prisma.invoiceCounter.findFirst();
      orgId = c?.organizationId;
    }
    if (!orgId) throw new Error('No organization for invoice counter');
    return prisma.invoiceCounter.update({
      where: { organizationId: orgId },
      data: { nextNumber: { increment: 1 } },
      select: { nextNumber: true },
    });
  },
};

module.exports = invoiceRepository;
