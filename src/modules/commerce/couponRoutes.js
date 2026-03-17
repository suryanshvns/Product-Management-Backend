const express = require('express');
const { validate, authenticate } = require('../../middlewares');
const couponController = require('./couponController');
const couponValidators = require('./couponValidators');

const router = express.Router();
router.use(authenticate);

router.post('/', validate(couponValidators.createCouponSchema, 'body'), couponController.create);
router.get('/', validate(couponValidators.listQuery, 'query'), couponController.list);
router.post('/validate', validate(couponValidators.validateCouponSchema, 'body'), couponController.validate);
router.get('/:id', validate(couponValidators.couponIdParam, 'params'), couponController.getById);
router.patch(
  '/:id',
  validate(couponValidators.couponIdParam, 'params'),
  validate(couponValidators.updateCouponSchema, 'body'),
  couponController.update
);

module.exports = router;
