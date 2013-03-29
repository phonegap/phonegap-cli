/*!
 * Module dependencies.
 */

var Static = require('node-static');

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
 * Returns:
 *
 *   {PhoneGap} instance for chaining.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional parameters
    options.port = options.port || 3000;
    callback = callback || function() {};

    // start app
    execute.call(this, options, callback);

    return this;
};

/*!
 * Execute.
 */

var execute = function(options, callback) {
    var self = this;

    // static file server
    var file = new Static.Server('./www');

    // create the server
    var server = require('http').createServer(function (request, response) {
        // on a request
        request.on('end', function () {
            // server the static file
            file.serve(request, response, function(e, response) {
                if (e) response = e; // e.status = 404
                self.emit('log', response.status, request.url);
            });
        });
    });

    // bind error
    server.on('error', function(e) {
        self.emit('err', e.message);
        callback(e);
    });

    // bind complete
    server.on('listening', function() {
        self.emit('log', 'listening on 127.0.0.1:' + options.port);
        callback(null, {
            address: '127.0.0.1',
            port: options.port
        });
    });

    // start the server
    self.emit('log', 'starting app server...');
    server.listen(options.port);
};
