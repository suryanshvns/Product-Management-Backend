const express = require('express');
const organizationController = require('../controllers/organizationController');
const { validate, authenticate } = require('../middlewares');
const organizationValidators = require('../validators/organizationValidators');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validate(organizationValidators.createOrganizationSchema, 'body'),
  organizationController.create
);
router.get('/', organizationController.list);
router.get(
  '/:id',
  validate(organizationValidators.organizationIdParam, 'params'),
  organizationController.getById
);
router.post(
  '/:id/members',
  validate(organizationValidators.organizationIdParam, 'params'),
  validate(organizationValidators.addMemberSchema, 'body'),
  organizationController.addMember
);
router.get(
  '/:id/members',
  validate(organizationValidators.organizationIdParam, 'params'),
  organizationController.getMembers
);

module.exports = router;
