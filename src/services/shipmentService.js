var Shipment = require('../models/Shipment');

module.exports = {
    listByUser: function(userId) {
        return Shipment.find({ userId: userId }).lean();
    },

    getById: function(id) {
        return Shipment.findById(id);
    },

    createShipment: function(data) {
        var newShipment = new Shipment(data);
        return newShipment.save();
    },

    updateStatus: function(id, status) {
        return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
    },

    deleteById: function(id) {
        return Shipment.findByIdAndDelete(id);
    }
};
