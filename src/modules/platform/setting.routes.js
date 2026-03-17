const express = require('express');
const settingController = require('./setting.controller');
const { validate, authenticate } = require('../../middlewares');
const settingValidators = require('./setting.validators');

const router = express.Router();

router.use(authenticate);

router.get('/list', validate(settingValidators.listSettingsQuery, 'query'), settingController.list);
router.get('/', validate(settingValidators.getSettingQuery, 'query'), settingController.get);
router.put('/', validate(settingValidators.setSettingBody, 'body'), settingController.set);

module.exports = router;
