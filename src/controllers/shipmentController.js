var shipmentService = require('../services/shipmentService');
var userService = require('../services/userService');
var response = require('../utils/response');

module.exports = {
    list: function(req, res) {
        shipmentService.listByUser(req.userId)
            .then(function(shipments) {
                return response.success(res, shipments);
            })
            .catch(function(err) {
                return response.error(res, 'Fetch failed', 500);
            });
    },

    getOne: function(req, res) {
        shipmentService.getById(req.params.id)
            .then(function(shipment) {
                if (!shipment) return response.error(res, 'Not found', 404);

                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return response.error(res, 'No access to this shipment', 403);
                }

                return response.success(res, shipment);
            })
            .catch(function(err) {
                return response.error(res, 'Error on findById', 500);
            });
    },

    create: function(req, res) {
        var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
        var payload = Object.assign({}, req.body, { trackingId: trackId, userId: req.userId, status: 'pending' });

        shipmentService.createShipment(payload)
            .then(function(saved) {
                return response.success(res, saved, 201);
            })
            .catch(function(err) {
                return response.error(res, 'Error saving shipment', 500);
            });
    },

    updateStatus: function(req, res) {
        if (req.body.status === 'delivered' && req.userRole !== 'admin') {
            return response.error(res, 'Admins only can deliver', 403);
        }

        shipmentService.updateStatus(req.params.id, req.body.status)
            .then(function(doc) {
                return response.success(res, doc);
            })
            .catch(function(err) {
                return response.error(res, 'Update failed', 500);
            });
    },

    remove: function(req, res) {
        // enforce ownership or admin
        shipmentService.getById(req.params.id)
            .then(function(shipment) {
                if (!shipment) return response.error(res, 'Not found', 404);
                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return response.error(res, 'No permission to delete', 403);
                }

                return shipmentService.deleteById(req.params.id);
            })
            .then(function() {
                return response.success(res, { message: 'Deleted' });
            })
            .catch(function(err) {
                return response.error(res, 'Delete error', 500);
            });
    }
};
