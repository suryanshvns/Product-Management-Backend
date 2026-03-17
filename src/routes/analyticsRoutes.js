const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { validate, authenticate } = require('../middlewares');
const analyticsValidators = require('../validators/analyticsValidators');

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
