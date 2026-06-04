module.exports = {
    success: function(res, data, statusCode) {
        return res.status(statusCode || 200).json({ success: true, data: data });
    },
    error: function(res, message, statusCode) {
        return res.status(statusCode || 400).json({ success: false, error: message });
    }
};
