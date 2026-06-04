const shipmentService = require('../services/shipmentService');
const response = require('../utils/response');
const { AppError, NotFoundError } = require('../utils/errors.util');

module.exports = {
    async list(req, res, next) {
        try {
            const shipments = await shipmentService.listByUser(req.userId);
            return response.success(res, shipments);
        } catch (err) {
            return next(err);
        }
    },

    async getOne(req, res, next) {
        try {
            const shipment = await shipmentService.getById(req.params.id);
            if (!shipment) return next(new NotFoundError('Shipment not found'));

            const ownerId = shipment.userId && shipment.userId._id
                ? shipment.userId._id.toString()
                : shipment.userId.toString();

            if (ownerId !== req.userId && req.userRole !== 'admin') {
                return next(new AppError('No access to this shipment', 403));
            }

            return response.success(res, shipment);
        } catch (err) {
            return next(err);
        }
    },

    async create(req, res, next) {
        try {
            const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
            const payload = Object.assign({}, req.body, { trackingId: trackId, userId: req.userId, status: 'pending' });

            const saved = await shipmentService.createShipment(payload);
            return response.success(res, saved, 201);
        } catch (err) {
            return next(err);
        }
    },

    async updateStatus(req, res, next) {
        try {
            if (req.body.status === 'delivered' && req.userRole !== 'admin') {
                return next(new AppError('Admins only can deliver', 403));
            }

            const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
            return response.success(res, doc);
        } catch (err) {
            return next(err);
        }
    },

    async remove(req, res, next) {
        try {
            // enforce ownership or admin
            const shipment = await shipmentService.getById(req.params.id);
            if (!shipment) return next(new NotFoundError('Shipment not found'));

            const ownerId = shipment.userId && shipment.userId._id
                ? shipment.userId._id.toString()
                : shipment.userId.toString();

            if (ownerId !== req.userId && req.userRole !== 'admin') {
                return next(new AppError('No permission to delete', 403));
            }

            await shipmentService.deleteById(req.params.id);
            return response.success(res, { message: 'Deleted' });
        } catch (err) {
            return next(err);
        }
    }
};
