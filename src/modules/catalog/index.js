const express = require('express');
const { ROUTES } = require('../../constants/routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const variantRoutes = require('./variantRoutes');
const tagRoutes = require('./tagRoutes');
const batchRoutes = require('./batchRoutes');
const relatedRoutes = require('./relatedRoutes');
const searchRoutes = require('./searchRoutes');

const router = express.Router();
router.use(ROUTES.PRODUCTS, productRoutes);
router.use(ROUTES.CATEGORIES, categoryRoutes);
router.use(ROUTES.PRODUCT_VARIANTS, variantRoutes);
router.use(ROUTES.TAGS, tagRoutes);
router.use(ROUTES.INVENTORY_BATCHES, batchRoutes);
router.use(ROUTES.RELATED_PRODUCTS, relatedRoutes);
router.use(ROUTES.SEARCH, searchRoutes);

module.exports = router;
