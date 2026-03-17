const express = require('express');
const { ROUTES } = require('../../constants/routes');
const priceListRoutes = require('./priceListRoutes');

const router = express.Router();
router.use(ROUTES.PRICE_LISTS, priceListRoutes);

module.exports = router;
