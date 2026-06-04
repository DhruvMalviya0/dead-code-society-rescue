const User = require('../models/User');
const hash = require('../utils/hash');

module.exports = {
    async registerUser(userData) {
        // whitelist expected fields
        const u = {
            name: userData.name,
            email: userData.email,
            password: hash.hash(userData.password),
            role: userData.role || 'user'
        };

        const newUser = new User(u);
        return newUser.save();
    },

    findByEmail(email) {
        return User.findOne({ email });
    },

    findById(id) {
        return User.findById(id);
    }
};
