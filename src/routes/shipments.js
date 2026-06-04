const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const auth = require('../middlewares/auth');

router.get('/', auth, shipmentController.list);
router.get('/:id', auth, shipmentController.getOne);
router.post('/', auth, shipmentController.create);
router.patch('/:id/status', auth, shipmentController.updateStatus);
router.delete('/:id', auth, shipmentController.remove);

module.exports = router;
