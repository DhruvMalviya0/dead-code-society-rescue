const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const { createSchema, statusSchema } = require('../validators/shipment');

router.get('/', auth, shipmentController.list);
router.get('/:id', auth, shipmentController.getOne);
router.post('/', auth, validate(createSchema), shipmentController.create);
router.patch('/:id/status', auth, validate(statusSchema), shipmentController.updateStatus);
router.delete('/:id', auth, shipmentController.remove);

module.exports = router;
