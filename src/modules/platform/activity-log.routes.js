const express = require('express');
const logController = require('./activity-log.controller');
const { validate, authenticate } = require('../../middlewares');
const logValidators = require('./activity-log.validators');

const router = express.Router();

router.use(authenticate);
router.get('/', validate(logValidators.listLogsQuery, 'query'), logController.list);

module.exports = router;
