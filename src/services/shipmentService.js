const Shipment = require('../models/Shipment');

module.exports = {
    /**
     * Returns all shipments for a user with owner details populated.
     * @param {string} userId - Owner user id.
     * @returns {Promise<Array<Object>>} Shipment list as lean objects.
     * @throws {Error} If the database query fails.
     */
    listByUser(userId) {
        return Shipment.find({ userId })
            .populate('userId', 'name email role')
            .lean();
    },

    /**
     * Returns one shipment by id with owner details populated.
     * @param {string} id - Shipment id.
     * @returns {Promise<import('mongoose').Document|null>} Shipment document or null.
     * @throws {Error} If the database query fails.
     */
    getById(id) {
        return Shipment.findById(id)
            .populate('userId', 'name email role');
    },

    /**
     * Creates a new shipment.
     * @param {Object} data - Shipment payload.
     * @returns {Promise<import('mongoose').Document>} Saved shipment document.
     * @throws {Error} If validation or persistence fails.
     */
    createShipment(data) {
        const newShipment = new Shipment(data);
        return newShipment.save();
    },

    /**
     * Updates shipment status and returns updated document.
     * @param {string} id - Shipment id.
     * @param {string} status - New status value.
     * @returns {Promise<import('mongoose').Document|null>} Updated shipment document or null.
     * @throws {Error} If the database update fails.
     */
    updateStatus(id, status) {
        return Shipment.findByIdAndUpdate(id, { status }, { new: true });
    },

    /**
     * Deletes a shipment by id.
     * @param {string} id - Shipment id.
     * @returns {Promise<import('mongoose').Document|null>} Deleted shipment document or null.
     * @throws {Error} If the database delete fails.
     */
    deleteById(id) {
        return Shipment.findByIdAndDelete(id);
    }
};
