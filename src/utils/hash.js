var md5 = require('md5');

module.exports = {
    hash: function(input) {
        return md5(input || '');
    }
};
