/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

/**
 * $ phonegap remote logout
 *
 * Logout of the current account and report whether it was a success or failure.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    phonegap.remote.logout(argv, function(e) {
        callback(e);
    });
};
