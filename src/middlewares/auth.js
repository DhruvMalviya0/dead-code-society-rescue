const jwtUtil = require('../utils/jwt');
const response = require('../utils/response');

module.exports = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return response.error(res, 'Unauthorized: missing token', 401);

    // accept `Bearer <token>` or raw token
    const parts = header.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : header;

    try {
        const decoded = jwtUtil.verify(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        return next();
    } catch (e) {
        return response.error(res, 'Unauthorized: invalid token', 401);
    }
};
