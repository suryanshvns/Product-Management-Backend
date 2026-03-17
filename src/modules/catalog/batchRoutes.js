const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const batchController = require('./batchController');
const batchValidators = require('./batchValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(batchValidators.createBatchSchema, 'body'), batchController.create);
router.get('/', validate(batchValidators.listQuery, 'query'), batchController.list);
router.get('/:id', validate(batchValidators.batchIdParam, 'params'), batchController.getById);
router.patch(
  '/:id',
  validate(batchValidators.batchIdParam, 'params'),
  validate(batchValidators.updateBatchSchema, 'body'),
  batchController.update
);
router.delete('/:id', validate(batchValidators.batchIdParam, 'params'), batchController.delete);

module.exports = router;
