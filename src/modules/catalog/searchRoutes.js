const express = require('express');
const { validate, optionalAuth } = require('../../middlewares');
const searchController = require('./searchController');
const searchValidators = require('./searchValidators');

const router = express.Router();
router.get('/products', validate(searchValidators.searchQuerySchema, 'query'), searchController.products);

module.exports = router;
