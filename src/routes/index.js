var express = require('express');
var router = express.Router();

var userRoutes = require('./users');
var shipmentRoutes = require('./shipments');

router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);

module.exports = router;
