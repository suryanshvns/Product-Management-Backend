const express = require('express');
const bulkImportController = require('./bulk-import.controller');
const { authenticate } = require('../../middlewares');

const router = express.Router();

router.use(authenticate);
router.post('/import/products', bulkImportController.importProducts);

module.exports = router;
