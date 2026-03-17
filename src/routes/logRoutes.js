const express = require('express');
const logController = require('../controllers/logController');
const { validate, authenticate } = require('../middlewares');
const logValidators = require('../validators/logValidators');

const router = express.Router();

router.use(authenticate);
router.get('/', validate(logValidators.listLogsQuery, 'query'), logController.list);

module.exports = router;
