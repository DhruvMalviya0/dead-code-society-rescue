module.exports = {
    success(res, data, statusCode) {
        return res.status(statusCode || 200).json({ success: true, data });
    },
    error(res, message, statusCode) {
        return res.status(statusCode || 400).json({ success: false, error: message });
    }
};
