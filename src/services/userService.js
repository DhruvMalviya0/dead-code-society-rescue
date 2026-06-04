const User = require('../models/User');
const hash = require('../utils/hash');

module.exports = {
    /**
     * Creates and persists a new user with a bcrypt-hashed password.
     * @param {{name: string, email: string, password: string, role?: string}} userData - User payload from request body.
     * @returns {Promise<import('mongoose').Document>} Saved user document.
     * @throws {Error} If hashing fails or database save fails.
     */
    async registerUser(userData) {
        // whitelist expected fields
        const passwordHash = await hash.hash(userData.password);
        const u = {
            name: userData.name,
            email: userData.email,
            password: passwordHash,
            role: userData.role || 'user'
        };

        const newUser = new User(u);
        return newUser.save();
    },

    /**
     * Finds a user by email.
     * @param {string} email - User email address.
     * @returns {Promise<import('mongoose').Document|null>} Matching user document or null.
     * @throws {Error} If the database query fails.
     */
    findByEmail(email) {
        return User.findOne({ email });
    },

    /**
     * Finds a user by id.
     * @param {string} id - User id.
     * @returns {Promise<import('mongoose').Document|null>} Matching user document or null.
     * @throws {Error} If the database query fails.
     */
    findById(id) {
        return User.findById(id);
    }
};
