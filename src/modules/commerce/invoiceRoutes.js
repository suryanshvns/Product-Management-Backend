const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const invoiceController = require('./invoiceController');
const invoiceValidators = require('./invoiceValidators');

const router = express.Router();
router.use(authenticate);

router.post('/generate', validate(invoiceValidators.generateInvoiceSchema, 'body'), invoiceController.generate);
router.get('/', validate(invoiceValidators.listQuery, 'query'), invoiceController.list);
router.get('/order/:orderId', validate(invoiceValidators.orderIdParam, 'params'), invoiceController.getByOrderId);
router.get('/order/:orderId/html', validate(invoiceValidators.orderIdParam, 'params'), invoiceController.html);
router.get('/number/:invoiceNumber', validate(invoiceValidators.invoiceNumberParam, 'params'), invoiceController.getByNumber);

module.exports = router;
