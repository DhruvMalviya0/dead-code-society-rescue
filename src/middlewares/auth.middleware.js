const jwtUtil = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Authenticates requests using the Authorization header JWT.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void} Calls next with success or unauthorized error.
 * @throws {UnauthorizedError} If token is missing, invalid, or expired.
 */
module.exports = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return next(new UnauthorizedError('Unauthorized: missing token'));

    const parts = header.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : header;

    try {
        const decoded = jwtUtil.verify(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        return next();
    } catch (e) {
        return next(new UnauthorizedError('Unauthorized: invalid token'));
    }
};
