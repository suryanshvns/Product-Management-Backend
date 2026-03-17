const express = require('express');
const productController = require('./product.controller');
const { validate, authenticate } = require('../../middlewares');
const { uploadProductImages } = require('../../middlewares/upload');
const productValidators = require('./product.validators');

const router = express.Router();

router.use(authenticate);

// Static routes first (before /:id)
router.post(
  '/bulk-delete',
  validate(productValidators.bulkDeleteSchema, 'body'),
  productController.bulkDelete
);
router.post(
  '/bulk-update-status',
  validate(productValidators.bulkUpdateStatusSchema, 'body'),
  productController.bulkUpdateStatus
);

router.post('/', validate(productValidators.createProductSchema, 'body'), productController.create);
router.get(
  '/',
  validate(productValidators.listProductsQuery, 'query'),
  productController.list
);
router.get(
  '/:id',
  validate(productValidators.productIdParam, 'params'),
  productController.getById
);
router.patch(
  '/:id',
  validate(productValidators.productIdParam, 'params'),
  validate(productValidators.updateProductSchema, 'body'),
  productController.update
);
router.delete(
  '/:id',
  validate(productValidators.productIdParam, 'params'),
  productController.delete
);
router.patch(
  '/:id/status',
  validate(productValidators.productIdParam, 'params'),
  validate(productValidators.updateStatusSchema, 'body'),
  productController.updateStatus
);
router.patch(
  '/:id/stock',
  validate(productValidators.productIdParam, 'params'),
  validate(productValidators.updateStockSchema, 'body'),
  productController.updateStock
);
router.post(
  '/:id/images',
  validate(productValidators.productIdParam, 'params'),
  uploadProductImages,
  productController.addImages
);
router.delete(
  '/:id/images/:imageId',
  validate(productValidators.productIdImageIdParam, 'params'),
  productController.deleteImage
);

module.exports = router;
