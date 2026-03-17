const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const wishlistController = require('./wishlistController');
const wishlistValidators = require('./wishlistValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(wishlistValidators.addWishlistSchema, 'body'), wishlistController.add);
router.get('/', validate(wishlistValidators.listQuery, 'query'), wishlistController.list);
router.delete('/:productId', validate(wishlistValidators.productIdParam, 'params'), wishlistController.remove);

module.exports = router;
