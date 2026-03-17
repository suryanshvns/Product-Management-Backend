const express = require('express');
const alertRuleController = require('./alert-rule.controller');
const { validate, authenticate } = require('../../middlewares');
const alertRuleValidators = require('./alert-rule.validators');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validate(alertRuleValidators.createAlertRuleSchema, 'body'),
  alertRuleController.create
);
router.get(
  '/',
  validate(alertRuleValidators.listAlertRulesQuery, 'query'),
  alertRuleController.list
);
router.get(
  '/:id',
  validate(alertRuleValidators.alertRuleIdParam, 'params'),
  alertRuleController.getById
);
router.patch(
  '/:id',
  validate(alertRuleValidators.alertRuleIdParam, 'params'),
  validate(alertRuleValidators.updateAlertRuleSchema, 'body'),
  alertRuleController.update
);
router.delete(
  '/:id',
  validate(alertRuleValidators.alertRuleIdParam, 'params'),
  alertRuleController.delete
);

module.exports = router;
