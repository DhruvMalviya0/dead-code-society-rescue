const userService = require('../services/userService');
const jwtUtil = require('../utils/jwt');
const response = require('../utils/response');

module.exports = {
    async register(req, res) {
        try {
            const user = await userService.registerUser(req.body);
            return response.success(res, { message: 'Account created', user }, 201);
        } catch (err) {
            return response.error(res, 'Cannot register', 400);
        }
    },

    async login(req, res) {
        try {
            const user = await userService.findByEmail(req.body.email);
            if (!user) return response.error(res, 'No user found with that email', 404);

            const hashUtil = require('../utils/hash');
            const isValid = await hashUtil.compare(req.body.password, user.password);
            if (!isValid) return response.error(res, 'Password does not match', 401);

            const token = jwtUtil.sign({ id: user._id, role: user.role }, { expiresIn: '12h' });
            return response.success(res, { token, data: { name: user.name, email: user.email, role: user.role } });
        } catch (err) {
            return response.error(res, 'Server error', 500);
        }
    },

    async profile(req, res) {
        try {
            const user = await userService.findById(req.userId);
            return response.success(res, user);
        } catch (err) {
            return response.error(res, 'Could not fetch profile', 500);
        }
    }
};
