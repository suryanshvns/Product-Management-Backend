const express = require('express');
const roleController = require('./role.controller');
const { validate, authenticate, requireRole } = require('../../middlewares');
const roleValidators = require('./role.validators');

const router = express.Router();

router.get('/', authenticate, roleController.list);

router.post(
  '/users/:userId/roles',
  authenticate,
  requireRole(['superadmin', 'admin']),
  validate(roleValidators.userIdParam, 'params'),
  validate(roleValidators.assignRoleBody, 'body'),
  roleController.assign
);

router.delete(
  '/users/:userId/roles/:roleId',
  authenticate,
  requireRole(['superadmin', 'admin']),
  validate(roleValidators.userIdRoleIdParams, 'params'),
  roleController.revoke
);

module.exports = router;
