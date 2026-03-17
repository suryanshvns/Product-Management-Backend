const { z } = require('zod');

const createAlertRuleSchema = z.object({
  name: z.string().min(1),
  conditionType: z.string().min(1),
  conditionConfig: z.record(z.unknown()).optional(),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateAlertRuleSchema = createAlertRuleSchema.partial();

const alertRuleIdParam = z.object({ id: z.string().min(1) });

const listAlertRulesQuery = z.object({
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  isActive: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

module.exports = {
  createAlertRuleSchema,
  updateAlertRuleSchema,
  alertRuleIdParam,
  listAlertRulesQuery,
};
