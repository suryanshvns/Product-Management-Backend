const { z } = require('zod');

const salesReportQuery = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

module.exports = { salesReportQuery };
