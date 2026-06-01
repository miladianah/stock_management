const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.post('/', transactionsController.create);
router.get('/', transactionsController.getAll);
router.put('/:id', transactionsController.update);
router.delete('/:id', transactionsController.remove);

module.exports = router;
