const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const shipmentRoutes = require('./shipments');

router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);

module.exports = router;
