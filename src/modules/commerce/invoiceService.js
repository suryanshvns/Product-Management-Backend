const invoiceRepository = require('./invoiceRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

function formatInvoiceNumber(seq, organizationId) {
  const year = new Date().getFullYear();
  const prefix = organizationId && organizationId !== 'default' ? 'INV' : 'INV';
  return `${prefix}-${year}-${String(seq).padStart(5, '0')}`;
}

function buildInvoiceHtml(invoice) {
  const order = invoice.order;
  const lines = (order.items || [])
    .map(
      (i) =>
        `<tr><td>${i.product?.name || 'Item'}</td><td>${i.quantity}</td><td>${i.unitPrice}</td><td>${i.totalPrice}</td></tr>`
    )
    .join('');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${invoice.invoiceNumber}</title></head>
<body>
  <h1>Invoice ${invoice.invoiceNumber}</h1>
  <p>Date: ${new Date(invoice.createdAt).toISOString().split('T')[0]}</p>
  <p>Order: ${order.id}</p>
  <table border="1" cellpadding="4">
    <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>${lines}</tbody>
  </table>
  <p><strong>Total: ${order.totalAmount}</strong></p>
</body>
</html>`;
}

const invoiceService = {
  generateForOrder: async (orderId, organizationId) => {
    let orgId = organizationId;
    if (!orgId) {
      const firstCounter = await prisma.invoiceCounter.findFirst();
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstCounter?.organizationId || firstOrg?.id;
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true, variant: true } }, invoice: true },
    });
    if (!order) throw new NotFoundError('Order not found');
    if (order.invoice) return invoiceRepository.findByOrderId(orderId);
    const counter = await invoiceRepository.getOrCreateCounter(orgId);
    const invoiceNumber = formatInvoiceNumber(counter.nextNumber, orgId);
    await invoiceRepository.incrementCounter(orgId);
    const invoice = await invoiceRepository.create({
      orderId: order.id,
      invoiceNumber,
      htmlBody: null,
    });
    const full = await invoiceRepository.findByOrderId(orderId);
    const html = buildInvoiceHtml(full);
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { htmlBody: html },
    });
    return invoiceRepository.findByOrderId(orderId);
  },

  getByOrderId: async (orderId) => {
    const invoice = await invoiceRepository.findByOrderId(orderId);
    if (!invoice) throw new NotFoundError('Invoice not found');
    return invoice;
  },

  getByInvoiceNumber: async (invoiceNumber) => {
    const invoice = await invoiceRepository.findByInvoiceNumber(invoiceNumber);
    if (!invoice) throw new NotFoundError('Invoice not found');
    return invoice;
  },

  list: async (filters) => invoiceRepository.findMany(filters),
};

module.exports = invoiceService;
