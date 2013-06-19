/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap version
 *
 * Outputs the version to the console.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    console.log(phonegap.version().npm);
    callback();
};
