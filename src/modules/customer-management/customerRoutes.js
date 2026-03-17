const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const customerController = require('./customerController');
const customerValidators = require('./customerValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(customerValidators.createCustomerSchema, 'body'), customerController.create);
router.get('/', validate(customerValidators.listQuery, 'query'), customerController.list);
router.get('/:id', validate(customerValidators.customerIdParam, 'params'), customerController.getById);
router.patch(
  '/:id',
  validate(customerValidators.customerIdParam, 'params'),
  validate(customerValidators.updateCustomerSchema, 'body'),
  customerController.update
);
router.delete('/:id', validate(customerValidators.customerIdParam, 'params'), customerController.delete);

module.exports = router;
