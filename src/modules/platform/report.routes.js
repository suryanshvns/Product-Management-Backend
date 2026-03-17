const express = require('express');
const reportController = require('./report.controller');
const { validate, authenticate } = require('../../middlewares');
const reportValidators = require('./report.validators');

const router = express.Router();

router.use(authenticate);

router.get('/sales', validate(reportValidators.salesReportQuery, 'query'), reportController.sales);
router.get('/inventory', reportController.inventory);
router.get('/export/products', reportController.exportProducts);

module.exports = router;
