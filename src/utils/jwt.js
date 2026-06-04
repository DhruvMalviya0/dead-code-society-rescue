const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = {
    /**
     * Signs a JWT for the provided payload.
     * @param {Object} payload - Claims payload to sign.
     * @param {Object} [opts] - Optional jsonwebtoken sign options.
     * @returns {string} Signed JWT token.
     * @throws {Error} If signing fails.
     */
    sign(payload, opts) {
        return jwt.sign(payload, JWT_SECRET, opts || {});
    },
    /**
     * Verifies and decodes a JWT.
     * @param {string} token - JWT token string.
     * @returns {Object|string} Decoded JWT payload.
     * @throws {Error} If token is invalid or expired.
     */
    verify(token) {
        return jwt.verify(token, JWT_SECRET);
    }
};
