const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const tagController = require('./tagController');
const tagValidators = require('./tagValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(tagValidators.createTagSchema, 'body'), tagController.create);
router.get('/', validate(tagValidators.listQuery, 'query'), tagController.list);
router.patch(
  '/product/:productId',
  validate(tagValidators.productIdParam, 'params'),
  validate(tagValidators.productTagsSchema, 'body'),
  tagController.setProductTags
);
router.post('/bulk-update', validate(tagValidators.bulkUpdateSchema, 'body'), tagController.bulkUpdate);
router.get('/:id', validate(tagValidators.tagIdParam, 'params'), tagController.getById);
router.patch(
  '/:id',
  validate(tagValidators.tagIdParam, 'params'),
  validate(tagValidators.updateTagSchema, 'body'),
  tagController.update
);
router.delete('/:id', validate(tagValidators.tagIdParam, 'params'), tagController.delete);

module.exports = router;
