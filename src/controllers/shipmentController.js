const shipmentService = require('../services/shipmentService');
const userService = require('../services/userService');
const response = require('../utils/response');

module.exports = {
    async list(req, res) {
        try {
            const shipments = await shipmentService.listByUser(req.userId);
            return response.success(res, shipments);
        } catch (err) {
            return response.error(res, 'Fetch failed', 500);
        }
    },

    async getOne(req, res) {
        try {
            const shipment = await shipmentService.getById(req.params.id);
            if (!shipment) return response.error(res, 'Not found', 404);

            if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                return response.error(res, 'No access to this shipment', 403);
            }

            return response.success(res, shipment);
        } catch (err) {
            return response.error(res, 'Error on findById', 500);
        }
    },

    async create(req, res) {
        try {
            const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
            const payload = Object.assign({}, req.body, { trackingId: trackId, userId: req.userId, status: 'pending' });

            const saved = await shipmentService.createShipment(payload);
            return response.success(res, saved, 201);
        } catch (err) {
            return response.error(res, 'Error saving shipment', 500);
        }
    },

    async updateStatus(req, res) {
        try {
            if (req.body.status === 'delivered' && req.userRole !== 'admin') {
                return response.error(res, 'Admins only can deliver', 403);
            }

            const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
            return response.success(res, doc);
        } catch (err) {
            return response.error(res, 'Update failed', 500);
        }
    },

    async remove(req, res) {
        try {
            // enforce ownership or admin
            const shipment = await shipmentService.getById(req.params.id);
            if (!shipment) return response.error(res, 'Not found', 404);
            if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                return response.error(res, 'No permission to delete', 403);
            }

            await shipmentService.deleteById(req.params.id);
            return response.success(res, { message: 'Deleted' });
        } catch (err) {
            return response.error(res, 'Delete error', 500);
        }
    }
};
