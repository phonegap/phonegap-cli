/*!
 * Module dependencies.
 */

var Static = require('node-static');
    events = require('events');

/**
 * Serve the App.
 *
 * Creates a local server to serve up the project. The intended
 * receiver is the PhoneGap App but any browser can consume the
 * content.
 *
 * Options:
 *
 *   - `options` {Object} is data required to create an app
 *     - `[port]` {Number} is the server port (default: 3000).
 *   - `[callback]` {Function} is triggered when server closes.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional parameters
    options.port = options.port || 3000;
    callback = callback || function() {};

    // event support
    var emitter = new events.EventEmitter();
    emitter.on('error', callback);

    // create app
    process.nextTick(function() {
        execute(options, emitter);
    });

    return emitter;
};

/*!
 * Execute.
 */

var execute = function(options, emitter) {
    var file = new Static.Server('./www');

    var server = require('http').createServer(function (request, response) {
        request.on('end', function () {
            file.serve(request, response, function(e, response) {
                if (e) response = e; // e.status = 404
                emitter.emit('request', request, response);
            });
        });
    });

    server.on('error', function(e) {
        emitter.emit('error', e);
    });

    server.on('listening', function() {
        emitter.emit('listening', {
            address: '127.0.0.1',
            port: options.port
        });
    });

    server.listen(options.port);
};
