var User = require('../models/User');
var hash = require('../utils/hash');

module.exports = {
    registerUser: function(userData) {
        // whitelist expected fields
        var u = {
            name: userData.name,
            email: userData.email,
            password: hash.hash(userData.password),
            role: userData.role || 'user'
        };

        var newUser = new User(u);
        return newUser.save();
    },

    findByEmail: function(email) {
        return User.findOne({ email: email });
    },

    findById: function(id) {
        return User.findById(id);
    }
};
