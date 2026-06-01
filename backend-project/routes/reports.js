const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/daily', reportsController.daily);
router.get('/weekly', reportsController.weekly);
router.get('/monthly', reportsController.monthly);
router.get('/stock-availability', reportsController.stockAvailability);
router.get('/dashboard', reportsController.dashboard);

module.exports = router;
