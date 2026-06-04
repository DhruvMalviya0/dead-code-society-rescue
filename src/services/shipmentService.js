const Shipment = require('../models/Shipment');

module.exports = {
    listByUser(userId) {
        return Shipment.find({ userId })
            .populate('userId', 'name email role')
            .lean();
    },

    getById(id) {
        return Shipment.findById(id)
            .populate('userId', 'name email role');
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
