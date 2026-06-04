module.exports = {
    /**
     * Sends a standardized success JSON response.
     * @param {import('express').Response} res - Express response.
     * @param {*} data - Response payload.
     * @param {number} [statusCode] - Optional HTTP status code.
     * @returns {import('express').Response} Express response object.
     * @throws {Error} If response serialization fails.
     */
    success(res, data, statusCode) {
        return res.status(statusCode || 200).json({ success: true, data });
    },
    /**
     * Sends a standardized error JSON response.
     * @param {import('express').Response} res - Express response.
     * @param {string} message - Error message.
     * @param {number} [statusCode] - Optional HTTP status code.
     * @returns {import('express').Response} Express response object.
     * @throws {Error} If response serialization fails.
     */
    error(res, message, statusCode) {
        return res.status(statusCode || 400).json({ success: false, error: message });
    }
};
