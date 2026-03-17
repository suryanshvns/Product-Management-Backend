const { z } = require('zod');

const listNotificationsQuery = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  unreadOnly: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
});

const notificationIdParam = z.object({
  id: z.string().min(1),
});

module.exports = { listNotificationsQuery, notificationIdParam };
