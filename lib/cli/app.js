/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

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
    // options
    var data = {
        port: argv.port || argv.p
    };

    // run app command
    var app = phonegap.app(data);

    app.on('error', function(e) {
        console.error(e.message);
    });

    app.on('complete', function(server) {
        console.log('Open the PhoneGap App on your device');
        console.log('Select "Local Development"');
        console.log('Address:', server.address);
        console.log('Port:', server.port);
        console.log('');
        console.log('Ctrl-C to stop the server');
    });

    app.on('log', function() {
        console.log.apply(this, arguments);
    });

    app.on('warn', function() {
        console.warn.apply(this, arguments);
    });

    app.on('request', function(request, response) {
        console.log(response.status, request.url);
    });
};
