var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, // using md5 for now, easy to test
        // SMELL: [CRITICAL] Storing passwords as fast hashes (MD5) is insecure. Use a slow, salted algorithm (bcrypt/argon2) and store only the salted hash.
        required: true
    },
    role: {
        type: String,
        default: 'user' // either 'user' or 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
