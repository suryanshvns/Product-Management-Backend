const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const quoteController = require('./quoteController');
const quoteValidators = require('./quoteValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(quoteValidators.createQuoteSchema, 'body'), quoteController.create);
router.get('/', validate(quoteValidators.listQuery, 'query'), quoteController.list);
router.get('/:id', validate(quoteValidators.quoteIdParam, 'params'), quoteController.getById);
router.patch(
  '/:id',
  validate(quoteValidators.quoteIdParam, 'params'),
  validate(quoteValidators.updateQuoteSchema, 'body'),
  quoteController.update
);
router.post(
  '/:id/lines',
  validate(quoteValidators.quoteIdParam, 'params'),
  validate(quoteValidators.addLineSchema, 'body'),
  quoteController.addLine
);
router.delete(
  '/:id/lines/:lineId',
  validate(quoteValidators.quoteIdParam, 'params'),
  quoteController.removeLine
);
router.post('/:id/convert-to-order', validate(quoteValidators.quoteIdParam, 'params'), quoteController.convertToOrder);

module.exports = router;
