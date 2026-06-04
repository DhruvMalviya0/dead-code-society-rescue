const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = {
    sign(payload, opts) {
        return jwt.sign(payload, JWT_SECRET, opts || {});
    },
    verify(token) {
        return jwt.verify(token, JWT_SECRET);
    }
};
