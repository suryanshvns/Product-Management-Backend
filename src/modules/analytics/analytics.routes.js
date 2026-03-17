const express = require('express');
const analyticsController = require('./analytics.controller');
const { validate, authenticate } = require('../../middlewares');
const analyticsValidators = require('./analytics.validators');

const router = express.Router();

router.use(authenticate);

router.get('/overview', analyticsController.overview);
router.get('/products-by-category', analyticsController.productsByCategory);
router.get(
  '/top-products',
  validate(analyticsValidators.topProductsQuery, 'query'),
  analyticsController.topProducts
);
router.get('/inventory-status', analyticsController.inventoryStatus);

module.exports = router;
