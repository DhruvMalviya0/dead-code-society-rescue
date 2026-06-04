const { ValidationError } = require('../utils/errors.util');

module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const errors = error.details.map(d => d.message);
        return next(new ValidationError(errors));
    }

    req.body = value;
    return next();
};
