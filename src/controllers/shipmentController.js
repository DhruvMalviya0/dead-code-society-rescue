const shipmentService = require('../services/shipmentService');
const response = require('../utils/response');
const { AppError, NotFoundError } = require('../utils/errors.util');

module.exports = {
    /**
     * Lists shipments owned by the authenticated user.
     * @param {import('express').Request} req - Express request with authenticated user id.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Shipment list response or forwarded error.
     * @throws {Error} If shipment retrieval fails.
     */
    async list(req, res, next) {
        try {
            const shipments = await shipmentService.listByUser(req.userId);
            return response.success(res, shipments);
        } catch (err) {
            return next(err);
        }
    },

    /**
     * Gets a single shipment and enforces owner/admin access.
     * @param {import('express').Request} req - Express request with shipment id param.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Shipment response or forwarded error.
     * @throws {NotFoundError} If shipment does not exist.
     * @throws {AppError} If requester is not authorized for this shipment.
     */
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

    /**
     * Creates a new shipment for the authenticated user.
     * @param {import('express').Request} req - Express request with validated shipment body.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Created shipment response or forwarded error.
     * @throws {Error} If shipment creation fails.
     */
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

    /**
     * Updates shipment status with role-based restriction for delivered status.
     * @param {import('express').Request} req - Express request with status payload and shipment id.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Updated shipment response or forwarded error.
     * @throws {AppError} If non-admin attempts to set delivered status.
     */
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

    /**
     * Deletes a shipment after owner/admin authorization check.
     * @param {import('express').Request} req - Express request with shipment id param.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Deletion success response or forwarded error.
     * @throws {NotFoundError} If shipment does not exist.
     * @throws {AppError} If requester is not allowed to delete the shipment.
     */
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
