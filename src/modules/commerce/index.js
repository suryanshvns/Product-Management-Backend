const express = require('express');
const { ROUTES } = require('../../constants/routes');
const orderRoutes = require('./order.routes');
const couponRoutes = require('./couponRoutes');
const invoiceRoutes = require('./invoiceRoutes');

const router = express.Router();
router.use(ROUTES.ORDERS, orderRoutes);
router.use(ROUTES.COUPONS, couponRoutes);
router.use(ROUTES.INVOICES, invoiceRoutes);

module.exports = router;
