const md5 = require('md5');

module.exports = {
    hash(input) {
        return md5(input || '');
    }
};
