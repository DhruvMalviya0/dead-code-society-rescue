var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipmentController');
var auth = require('../middlewares/auth');

router.get('/', auth, shipmentController.list);
router.get('/:id', auth, shipmentController.getOne);
router.post('/', auth, shipmentController.create);
router.patch('/:id/status', auth, shipmentController.updateStatus);
router.delete('/:id', auth, shipmentController.remove);

module.exports = router;
