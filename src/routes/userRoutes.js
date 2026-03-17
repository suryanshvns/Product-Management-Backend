const express = require('express');
const userController = require('../controllers/userController');
const { validate, authenticate, requireRole } = require('../middlewares');
const userValidators = require('../validators/userValidators');

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole(['superadmin', 'admin']),
  validate(userValidators.listUsersQuery, 'query'),
  userController.list
);

router.get(
  '/:id',
  authenticate,
  validate(userValidators.userIdParam, 'params'),
  userController.get
);

router.patch(
  '/:id',
  authenticate,
  validate(userValidators.userIdParam, 'params'),
  validate(userValidators.updateUserBody, 'body'),
  userController.update
);

module.exports = router;
