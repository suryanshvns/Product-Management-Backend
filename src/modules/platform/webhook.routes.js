const express = require('express');
const webhookController = require('./webhook.controller');
const { validate, authenticate } = require('../../middlewares');
const webhookValidators = require('./webhook.validators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(webhookValidators.createWebhookSchema, 'body'), webhookController.create);
router.get('/', webhookController.list);
router.get('/:id', validate(webhookValidators.webhookIdParam, 'params'), webhookController.getById);
router.patch(
  '/:id',
  validate(webhookValidators.webhookIdParam, 'params'),
  validate(webhookValidators.updateWebhookSchema, 'body'),
  webhookController.update
);
router.delete('/:id', validate(webhookValidators.webhookIdParam, 'params'), webhookController.delete);

module.exports = router;
