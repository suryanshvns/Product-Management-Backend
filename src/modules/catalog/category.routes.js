const express = require('express');
const categoryController = require('./category.controller');
const { validate, authenticate } = require('../../middlewares');
const categoryValidators = require('./category.validators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(categoryValidators.createCategorySchema, 'body'), categoryController.create);
router.get('/', categoryController.list);
router.get(
  '/:id',
  validate(categoryValidators.categoryIdParam, 'params'),
  categoryController.getById
);
router.patch(
  '/:id',
  validate(categoryValidators.categoryIdParam, 'params'),
  validate(categoryValidators.updateCategorySchema, 'body'),
  categoryController.update
);
router.delete(
  '/:id',
  validate(categoryValidators.categoryIdParam, 'params'),
  categoryController.delete
);

module.exports = router;
