/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap push
 *
 * Outputs the version to the console.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    // options
    var data = {
        deviceID: argv.deviceID,
        service: argv.service,
        payload: argv.payload,
        file: argv.file
    };

    phonegap.push(data, function(e, server) {
        callback(e);
    });
};
