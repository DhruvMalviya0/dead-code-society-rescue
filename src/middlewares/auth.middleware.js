const jwtUtil = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors.util');

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
