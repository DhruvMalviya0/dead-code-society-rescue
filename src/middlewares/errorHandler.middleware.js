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
