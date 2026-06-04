var jwtUtil = require('../utils/jwt');
var response = require('../utils/response');

module.exports = function(req, res, next) {
    var header = req.headers['authorization'];
    if (!header) return response.error(res, 'Unauthorized: missing token', 401);

    // accept `Bearer <token>` or raw token
    var parts = header.split(' ');
    var token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : header;

    try {
        var decoded = jwtUtil.verify(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        return next();
    } catch (e) {
        return response.error(res, 'Unauthorized: invalid token', 401);
    }
};
