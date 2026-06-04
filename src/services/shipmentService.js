const Shipment = require('../models/Shipment');

module.exports = {
    listByUser(userId) {
        return Shipment.find({ userId }).lean();
    },

    getById(id) {
        return Shipment.findById(id);
    },

    createShipment(data) {
        const newShipment = new Shipment(data);
        return newShipment.save();
    },

    updateStatus(id, status) {
        return Shipment.findByIdAndUpdate(id, { status }, { new: true });
    },

    deleteById(id) {
        return Shipment.findByIdAndDelete(id);
    }
};
