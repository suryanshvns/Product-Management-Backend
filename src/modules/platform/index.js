const express = require('express');
const { ROUTES } = require('../../constants/routes');
const healthRoutes = require('./health.routes');
const healthController = require('./health.controller');
const notificationRoutes = require('./notification.routes');
const activityLogRoutes = require('./activity-log.routes');
const alertRuleRoutes = require('./alert-rule.routes');
const reportRoutes = require('./report.routes');
const dashboardRoutes = require('./dashboard.routes');
const settingRoutes = require('./setting.routes');
const apiKeyRoutes = require('./api-key.routes');
const webhookRoutes = require('./webhook.routes');
const bulkImportRoutes = require('./bulk-import.routes');

const router = express.Router();

router.use(ROUTES.HEALTH, healthRoutes);
router.get(ROUTES.PING, healthController.ping);
router.use(ROUTES.LOGS, activityLogRoutes);
router.use(ROUTES.NOTIFICATIONS, notificationRoutes);
router.use(ROUTES.ALERT_RULES, alertRuleRoutes);
router.use(ROUTES.REPORTS, reportRoutes);
router.use(ROUTES.DASHBOARD, dashboardRoutes);
router.use(ROUTES.SETTINGS, settingRoutes);
router.use(ROUTES.API_KEYS, apiKeyRoutes);
router.use(ROUTES.WEBHOOKS, webhookRoutes);
router.use(ROUTES.BULK, bulkImportRoutes);

module.exports = router;
