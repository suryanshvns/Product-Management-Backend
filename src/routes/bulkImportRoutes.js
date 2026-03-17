const express = require('express');
const bulkImportController = require('../controllers/bulkImportController');
const { authenticate } = require('../middlewares');

const router = express.Router();

router.use(authenticate);
router.post('/import/products', bulkImportController.importProducts);

module.exports = router;
