const express = require('express');
const { ROUTES } = require('../../constants/routes');
const customerRoutes = require('./customerRoutes');
const customerGroupRoutes = require('./customerGroupRoutes');
const addressRoutes = require('./addressRoutes');
const quoteRoutes = require('./quoteRoutes');

const router = express.Router();
router.use(ROUTES.CUSTOMERS, customerRoutes);
router.use(ROUTES.CUSTOMER_GROUPS, customerGroupRoutes);
router.use(ROUTES.CUSTOMER_ADDRESSES, addressRoutes);
router.use(ROUTES.QUOTES, quoteRoutes);

module.exports = router;
