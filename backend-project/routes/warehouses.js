const express = require('express');
const router = express.Router();
const warehousesController = require('../controllers/warehousesController');

router.post('/', warehousesController.create);
router.get('/', warehousesController.getAll);

module.exports = router;
