/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap share
 *
 * Outputs the version to the console.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    var data = {
        connect: argv.connect
    };

    phonegap.share(data, function(e) {
        callback(e);
    });
};
