const { ValidationError } = require('../utils/errors.util');

/**
 * Creates a body validation middleware for the provided Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi schema used to validate req.body.
 * @returns {import('express').RequestHandler} Express middleware that validates and sanitizes request body.
 * @throws {ValidationError} When request body fails Joi validation.
 */
module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const errors = error.details.map(d => d.message);
        return next(new ValidationError(errors));
    }

    req.body = value;
    return next();
};
