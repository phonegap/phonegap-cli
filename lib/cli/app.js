/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

/**
 * $ phonegap app [options]
 *
 * Serves the app on a local web server.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    // options
    var data = {
        port: argv.port || argv.p
    };

    // run app command
    var app = phonegap.app(data, function(e, server) {
        if (!e) {
            console.log('');
            console.log('ctrl-c to stop the server');
            console.log('');
        }

        callback(e);
    });
};
