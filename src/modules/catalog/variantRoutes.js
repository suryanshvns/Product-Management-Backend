const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const variantController = require('./variantController');
const variantValidators = require('./variantValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(variantValidators.createVariantSchema, 'body'), variantController.create);
router.get('/reorder-suggestions', validate(variantValidators.listQuery, 'query'), variantController.reorderSuggestions);
router.get('/', validate(variantValidators.listQuery, 'query'), variantController.list);
router.get('/:id', validate(variantValidators.variantIdParam, 'params'), variantController.getById);
router.patch(
  '/:id',
  validate(variantValidators.variantIdParam, 'params'),
  validate(variantValidators.updateVariantSchema, 'body'),
  variantController.update
);
router.patch(
  '/:id/stock',
  validate(variantValidators.variantIdParam, 'params'),
  validate(variantValidators.stockDeltaSchema, 'body'),
  variantController.updateStock
);
router.delete('/:id', validate(variantValidators.variantIdParam, 'params'), variantController.delete);

module.exports = router;
