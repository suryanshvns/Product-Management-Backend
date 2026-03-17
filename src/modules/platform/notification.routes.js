const express = require('express');
const notificationController = require('./notification.controller');
const { validate, authenticate } = require('../../middlewares');
const notificationValidators = require('./notification.validators');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  validate(notificationValidators.listNotificationsQuery, 'query'),
  notificationController.list
);
router.patch(
  '/:id/read',
  validate(notificationValidators.notificationIdParam, 'params'),
  notificationController.markAsRead
);
router.post('/read-all', notificationController.markAllAsRead);

module.exports = router;
