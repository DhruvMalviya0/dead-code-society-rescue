const Joi = require('joi');

const createSchema = Joi.object({
    origin: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
    weight: Joi.number().positive().required(),
    carrier: Joi.string().min(1).required()
});

const statusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = { createSchema, statusSchema };
