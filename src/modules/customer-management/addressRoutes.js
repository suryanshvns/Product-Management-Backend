const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const addressController = require('./addressController');
const addressValidators = require('./addressValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(addressValidators.createAddressSchema, 'body'), addressController.create);
router.get('/customer/:customerId', validate(addressValidators.customerIdParam, 'params'), addressController.listByCustomer);
router.get('/:id', validate(addressValidators.addressIdParam, 'params'), addressController.getById);
router.patch(
  '/:id',
  validate(addressValidators.addressIdParam, 'params'),
  validate(addressValidators.updateAddressSchema, 'body'),
  addressController.update
);
router.delete('/:id', validate(addressValidators.addressIdParam, 'params'), addressController.delete);
router.post(
  '/customer/:customerId/default/:id',
  validate(addressValidators.customerIdParam, 'params'),
  addressController.setDefault
);

module.exports = router;
