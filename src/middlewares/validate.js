const Joi = require('joi');
const response = require('../utils/response');

module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const errors = error.details.map(d => d.message);
        return res.status(422).json({ success: false, errors });
    }

    req.body = value;
    return next();
};
