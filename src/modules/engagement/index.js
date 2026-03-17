const express = require('express');
const { ROUTES } = require('../../constants/routes');
const reviewRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');

const router = express.Router();
router.use(ROUTES.REVIEWS, reviewRoutes);
router.use(ROUTES.WISHLIST, wishlistRoutes);

module.exports = router;
