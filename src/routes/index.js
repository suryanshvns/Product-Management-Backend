const express = require('express');
const { ROUTES } = require('../constants/routes');

const authenticationRoutes = require('../modules/authentication/auth.routes');
const userManagementRoutes = require('../modules/user-management/user.routes');
const accessControlRoutes = require('../modules/access-control/role.routes');
const organizationManagementRoutes = require('../modules/organization-management/organization.routes');
const catalogModule = require('../modules/catalog');
const commerceModule = require('../modules/commerce');
const customerManagementModule = require('../modules/customer-management');
const engagementModule = require('../modules/engagement');
const pricingModule = require('../modules/pricing');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const platformModule = require('../modules/platform');

const router = express.Router();

router.use(platformModule);
router.use(ROUTES.AUTH, authenticationRoutes);
router.use(ROUTES.USERS, userManagementRoutes);
router.use(ROUTES.ROLES, accessControlRoutes);
router.use(ROUTES.ORGANIZATIONS, organizationManagementRoutes);
router.use(catalogModule);
router.use(ROUTES.ANALYTICS, analyticsRoutes);
router.use(commerceModule);
router.use(customerManagementModule);
router.use(engagementModule);
router.use(pricingModule);

module.exports = router;
