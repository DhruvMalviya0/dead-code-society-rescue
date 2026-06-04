var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = {
    sign: function(payload, opts) {
        return jwt.sign(payload, JWT_SECRET, opts || {});
    },
    verify: function(token) {
        return jwt.verify(token, JWT_SECRET);
    }
};
