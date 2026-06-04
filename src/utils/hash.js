const bcrypt = require('bcrypt');

module.exports = {
    async hash(input) {
        const s = input || '';
        return bcrypt.hash(s, 12);
    },
    async compare(plain, hashed) {
        return bcrypt.compare(plain, hashed);
    }
};
