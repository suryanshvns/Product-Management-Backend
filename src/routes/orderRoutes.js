const express = require('express');
const orderController = require('../controllers/orderController');
const { validate, authenticate } = require('../middlewares');
const orderValidators = require('../validators/orderValidators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(orderValidators.createOrderSchema, 'body'), orderController.create);
router.get('/', validate(orderValidators.listOrdersQuery, 'query'), orderController.list);
router.get('/:id', validate(orderValidators.orderIdParam, 'params'), orderController.getById);
router.patch(
  '/:id/status',
  validate(orderValidators.orderIdParam, 'params'),
  validate(orderValidators.updateStatusSchema, 'body'),
  orderController.updateStatus
);

module.exports = router;
