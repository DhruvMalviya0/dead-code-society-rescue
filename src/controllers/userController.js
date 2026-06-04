const userService = require('../services/userService');
const jwtUtil = require('../utils/jwt');
const response = require('../utils/response');
const hashUtil = require('../utils/hash');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');

module.exports = {
    /**
     * Registers a user and returns a created response.
     * @param {import('express').Request} req - Express request containing validated user body.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Created response or forwarded error.
     * @throws {ConflictError} If email already exists.
     */
    async register(req, res, next) {
        try {
            const user = await userService.registerUser(req.body);
            return response.success(res, { message: 'Account created', user }, 201);
        } catch (err) {
            if (err && err.code === 11000) {
                return next(new ConflictError('Email already exists'));
            }
            return next(err);
        }
    },

    /**
     * Authenticates user credentials and returns a signed JWT payload.
     * @param {import('express').Request} req - Express request containing login body.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} Success response or forwarded error.
     * @throws {NotFoundError} If no user exists for the given email.
     * @throws {UnauthorizedError} If password verification fails.
     */
    async login(req, res, next) {
        try {
            const user = await userService.findByEmail(req.body.email);
            if (!user) return next(new NotFoundError('No user found with that email'));

            const isValid = await hashUtil.compare(req.body.password, user.password);
            if (!isValid) return next(new UnauthorizedError('Invalid credentials'));

            const token = jwtUtil.sign({ id: user._id, role: user.role }, { expiresIn: '12h' });
            return response.success(res, { token, data: { name: user.name, email: user.email, role: user.role } });
        } catch (err) {
            return next(err);
        }
    },

    /**
     * Returns current authenticated user profile.
     * @param {import('express').Request} req - Express request containing authenticated user id.
     * @param {import('express').Response} res - Express response.
     * @param {import('express').NextFunction} next - Express next callback.
     * @returns {Promise<import('express').Response|void>} User profile response or forwarded error.
     * @throws {NotFoundError} If the user no longer exists.
     */
    async profile(req, res, next) {
        try {
            const user = await userService.findById(req.userId);
            if (!user) return next(new NotFoundError('User not found'));
            return response.success(res, user);
        } catch (err) {
            return next(err);
        }
    }
};
