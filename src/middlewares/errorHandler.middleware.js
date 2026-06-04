/**
 * Centralized Express error handler.
 * @param {Error & {statusCode?: number, errors?: string[]}} err - Error object from previous middleware/controllers.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {import('express').Response} Error response payload.
 * @throws {Error} If response writing fails.
 */
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode === 422 && Array.isArray(err.errors)) {
        return res.status(422).json({ success: false, errors: err.errors });
    }

    const message = statusCode >= 500 ? 'Internal server error' : err.message;
    return res.status(statusCode).json({
        success: false,
        error: message
    });
};
