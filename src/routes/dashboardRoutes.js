const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares');

const router = express.Router();

router.use(authenticate);
router.get('/summary', dashboardController.summary);

module.exports = router;
