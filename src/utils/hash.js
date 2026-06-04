const bcrypt = require('bcrypt');

module.exports = {
    /**
     * Hashes a plaintext value using bcrypt with 12 rounds.
     * @param {string} input - Plaintext value to hash.
     * @returns {Promise<string>} Bcrypt hash string.
     * @throws {Error} If bcrypt hashing fails.
     */
    async hash(input) {
        const s = input || '';
        return bcrypt.hash(s, 12);
    },
    /**
     * Compares a plaintext value with a bcrypt hash.
     * @param {string} plain - Plaintext input value.
     * @param {string} hashed - Stored bcrypt hash value.
     * @returns {Promise<boolean>} True when values match, otherwise false.
     * @throws {Error} If bcrypt comparison fails.
     */
    async compare(plain, hashed) {
        return bcrypt.compare(plain, hashed);
    }
};
