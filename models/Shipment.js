var mongoose = require('mongoose');

var shipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    // SMELL: [MEDIUM] Relying solely on `unique: true` without an index migration/atomic check can still allow rare collisions under race conditions.
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending' // pending, in-progress, delivered, cancelled
        // SMELL: [MEDIUM] Status is a free-form string; prefer enum validation to avoid typos and to improve DB consistency.
    },
    weight: {
        type: Number,
        required: true
        // SMELL: [MEDIUM] No validation on `weight` (e.g., min>0). Invalid or negative weights could be stored.
    },
    carrier: {
        type: String,
        required: true
    },
    // which user this shipment belongs to
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// hook for pre-save on model
shipmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
