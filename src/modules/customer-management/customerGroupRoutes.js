const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const customerGroupController = require('./customerGroupController');
const customerGroupValidators = require('./customerGroupValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(customerGroupValidators.createGroupSchema, 'body'), customerGroupController.create);
router.get('/', validate(customerGroupValidators.listQuery, 'query'), customerGroupController.list);
router.get('/:id', validate(customerGroupValidators.groupIdParam, 'params'), customerGroupController.getById);
router.patch(
  '/:id',
  validate(customerGroupValidators.groupIdParam, 'params'),
  validate(customerGroupValidators.updateGroupSchema, 'body'),
  customerGroupController.update
);
router.delete('/:id', validate(customerGroupValidators.groupIdParam, 'params'), customerGroupController.delete);

module.exports = router;
