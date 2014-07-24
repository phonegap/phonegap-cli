/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

/**
 * $ phonegap serve [options]
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
        port: argv.port || argv.p,
        autoreload: argv.autoreload,
        localtunnel: argv.localtunnel
    };

    phonegap.serve(data, function(e, server) {
        if (!e) {
            console.log('');
            console.log('ctrl-c to stop the server');
            console.log('');
        }

        callback(e);
    });
};
