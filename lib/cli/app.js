/*!
 * Module dependencies.
 */

var console = require('./console');

/**
 * Command line app command.
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
    var self = this;

    // options
    var data = {
        port: argv.port || argv.p
    };

    // run app command
    var app = self.phonegap.app(data);

    app.on('error', function(e) {
        console.error('failed to setup app connection:', e.message);
    });

    app.on('listening', function(server) {
        console.log('Open the PhoneGap App on your device');
        console.log('Select "Local Development"');
        console.log('Address:', server.address);
        console.log('Port:', server.port);
    });

    app.on('request', function(request, response) {
        console.log(response.status, request.url);
    });
};
