const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const priceListController = require('./priceListController');
const priceListValidators = require('./priceListValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(priceListValidators.createPriceListSchema, 'body'), priceListController.create);
router.get('/', validate(priceListValidators.listQuery, 'query'), priceListController.list);
router.get('/:id', validate(priceListValidators.priceListIdParam, 'params'), priceListController.getById);
router.patch(
  '/:id',
  validate(priceListValidators.priceListIdParam, 'params'),
  validate(priceListValidators.updatePriceListSchema, 'body'),
  priceListController.update
);
router.delete('/:id', validate(priceListValidators.priceListIdParam, 'params'), priceListController.delete);
router.post(
  '/:id/items',
  validate(priceListValidators.priceListIdParam, 'params'),
  validate(priceListValidators.setItemSchema, 'body'),
  priceListController.setItem
);

module.exports = router;
