/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    Static = require('node-static'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new AppCommand(phonegap);
    }
};

function AppCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(AppCommand, Command);

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
 *   {PhoneGap} for chaining.
 */

AppCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional parameters
    options.port = options.port || 3000;
    callback = callback || function() {};

    // start app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute command.
 */

AppCommand.prototype.execute = function(options, callback) {
    var self = this,
        file = new Static.Server('./www');

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // create the server
    var server = require('http').createServer(function (request, response) {
        // on a request
        request.on('end', function () {
            // server the static file
            file.serve(request, response, function(e, response) {
                if (e) response = e; // e.status = 404
                self.phonegap.emit('log', response.status, request.url);
            });
        });
    });

    // bind error
    server.on('error', function(e) {
        self.phonegap.emit('error', e);
        callback(e);
    });

    // bind complete
    server.on('listening', function() {
        self.phonegap.emit('log', 'listening on 127.0.0.1:' + options.port);
        callback(null, {
            address: '127.0.0.1',
            port: options.port
        });
    });

    // start the server
    self.phonegap.emit('log', 'starting app server...');
    server.listen(options.port);
};
