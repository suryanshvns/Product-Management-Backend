const { z } = require('zod');

const createApiKeySchema = z.object({
  name: z.string().min(1),
  organizationId: z.string().optional(),
});

const apiKeyIdParam = z.object({ id: z.string().min(1) });

module.exports = { createApiKeySchema, apiKeyIdParam };
