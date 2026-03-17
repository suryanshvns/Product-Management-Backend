const { z } = require('zod');

const createWebhookSchema = z.object({
  url: z.string().url(),
  secret: z.string().optional(),
  events: z.array(z.string()).min(1),
  organizationId: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateWebhookSchema = createWebhookSchema.partial();

const webhookIdParam = z.object({ id: z.string().min(1) });

module.exports = { createWebhookSchema, updateWebhookSchema, webhookIdParam };
