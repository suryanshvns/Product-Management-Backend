const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const relatedController = require('./relatedController');
const relatedValidators = require('./relatedValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(relatedValidators.addRelatedSchema, 'body'), relatedController.add);
router.delete(
  '/:productId/:relatedProductId',
  validate(relatedValidators.removeRelatedParams, 'params'),
  relatedController.remove
);
router.get(
  '/:productId',
  validate(relatedValidators.productIdParam, 'params'),
  validate(relatedValidators.listQuery, 'query'),
  relatedController.list
);

module.exports = router;
