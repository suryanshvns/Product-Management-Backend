const { z } = require('zod');

const getSettingQuery = z.object({
  scope: z.enum(['global', 'organization']),
  scopeId: z.string().optional(),
  key: z.string().min(1),
});

const setSettingBody = z.object({
  scope: z.enum(['global', 'organization']),
  scopeId: z.string().optional(),
  organizationId: z.string().optional(),
  key: z.string().min(1),
  value: z.unknown(),
});

const listSettingsQuery = z.object({
  scope: z.enum(['global', 'organization']),
  scopeId: z.string().optional(),
});

module.exports = { getSettingQuery, setSettingBody, listSettingsQuery };
