/*!
 * Module dependencies.
 */

var Static = require('node-static'),
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
 *   - `options` {Object}
 *     - `[port]` {Number} is the server port (default: 3000).
 *   - `[callback]` {Function} is triggered when server starts.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `complete` {Event} will never fire.
 *     - `server` {Object} with `address` and `port` properties.
 *   - `error` {Event} fires on an error.
 *     - `e` {Error} is an error object.
 *   - `log` {Event} fires with log info compatible with `console.log`.
 *   - `warn` {Event} fires with warning info compatible with `console.warn`.
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

    // start app
    process.nextTick(function() {
        execute(options, emitter);
    });

    return emitter;
};

/*!
 * Execute.
 */

var execute = function(options, emitter) {
    // static file server
    var file = new Static.Server('./www');

    // create the server
    var server = require('http').createServer(function (request, response) {
        // on a request
        request.on('end', function () {
            // server the static file
            file.serve(request, response, function(e, response) {
                if (e) response = e; // e.status = 404
                emitter.emit('request', request, response);
            });
        });
    });

    // bind error
    server.on('error', function(e) {
        emitter.emit('error', e);
    });

    // bind complete
    server.on('listening', function() {
        emitter.emit('complete', {
            address: '127.0.0.1',
            port: options.port
        });
    });

    // start the server
    server.listen(options.port);
};
