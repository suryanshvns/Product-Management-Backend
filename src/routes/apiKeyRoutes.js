const express = require('express');
const apiKeyController = require('../controllers/apiKeyController');
const { validate, authenticate } = require('../middlewares');
const apiKeyValidators = require('../validators/apiKeyValidators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(apiKeyValidators.createApiKeySchema, 'body'), apiKeyController.create);
router.get('/', apiKeyController.list);
router.delete('/:id', validate(apiKeyValidators.apiKeyIdParam, 'params'), apiKeyController.revoke);

module.exports = router;
