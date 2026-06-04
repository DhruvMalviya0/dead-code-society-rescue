const userService = require('../services/userService');
const jwtUtil = require('../utils/jwt');
const response = require('../utils/response');
const hashUtil = require('../utils/hash');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');

module.exports = {
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
