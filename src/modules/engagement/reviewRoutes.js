const express = require('express');
const { validate, authenticate, optionalAuth } = require('../../middlewares');
const reviewController = require('./reviewController');
const reviewValidators = require('./reviewValidators');

const router = express.Router();
router.post('/', authenticate, validate(reviewValidators.createReviewSchema, 'body'), reviewController.create);
router.get(
  '/product/:productId',
  validate(reviewValidators.productIdParam, 'params'),
  validate(reviewValidators.listQuery, 'query'),
  reviewController.getByProduct
);
router.patch(
  '/product/:productId',
  authenticate,
  validate(reviewValidators.productIdParam, 'params'),
  validate(reviewValidators.updateReviewSchema, 'body'),
  reviewController.update
);
router.delete(
  '/product/:productId',
  authenticate,
  validate(reviewValidators.productIdParam, 'params'),
  reviewController.delete
);

module.exports = router;
