const express = require('express');
const authController = require('./auth.controller');
const { validate, authenticate } = require('../../middlewares');
const authValidators = require('../../validators');

const router = express.Router();

router.post(
  '/signup',
  validate(authValidators.signup, 'body'),
  authController.signup
);
router.post(
  '/login',
  validate(authValidators.login, 'body'),
  authController.login
);
router.post(
  '/logout',
  validate(authValidators.logout, 'body'),
  authController.logout
);
router.get('/me', authenticate, authController.me);
router.post(
  '/refresh-token',
  validate(authValidators.refreshToken, 'body'),
  authController.refreshToken
);

module.exports = router;
