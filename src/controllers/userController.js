var userService = require('../services/userService');
var jwtUtil = require('../utils/jwt');
var response = require('../utils/response');

module.exports = {
    register: function(req, res) {
        userService.registerUser(req.body)
            .then(function(user) {
                return response.success(res, { message: 'Account created', user: user }, 201);
            })
            .catch(function(err) {
                return response.error(res, 'Cannot register', 400);
            });
    },

    login: function(req, res) {
        userService.findByEmail(req.body.email)
            .then(function(user) {
                if (!user) return response.error(res, 'No user found with that email', 404);

                var hashed = require('../utils/hash').hash(req.body.password);
                if (user.password === hashed) {
                    var token = jwtUtil.sign({ id: user._id, role: user.role }, { expiresIn: '12h' });
                    return response.success(res, { token: token, data: { name: user.name, email: user.email, role: user.role } });
                }

                return response.error(res, 'Password does not match', 401);
            })
            .catch(function(err) {
                return response.error(res, 'Server error', 500);
            });
    },

    profile: function(req, res) {
        userService.findById(req.userId)
            .then(function(user) {
                return response.success(res, user);
            })
            .catch(function(err) {
                return response.error(res, 'Could not fetch profile', 500);
            });
    }
};
