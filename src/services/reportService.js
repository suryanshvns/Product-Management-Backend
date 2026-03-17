const reportRepository = require('../repositories/reportRepository');

const reportService = {
  salesReport: async (filters) => {
    return reportRepository.salesReport(filters);
  },

  inventoryReport: async () => {
    return reportRepository.inventoryReport();
  },

  exportProductsCsv: async (filters) => {
    const { prisma } = require('../database/client');
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: { category: true, inventory: true },
      take: 5000,
    });
    const headers = ['id', 'name', 'slug', 'category', 'status', 'quantity', 'lowStockThreshold'];
    const rows = products.map((p) =>
      [
        p.id,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.slug,
        p.category?.name || '',
        p.status,
        p.inventory?.quantity ?? '',
        p.inventory?.lowStockThreshold ?? '',
      ].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  },
};

module.exports = reportService;
