/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    server = require('connect-phonegap'),
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
 *     - `[autoreload]` {Boolean} refreshes app on file system changes (default: true)
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
    options.autoreload = (typeof options.autoreload === 'boolean') ? options.autoreload : true;
    callback = callback || function() {};

    // start app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute command.
 */

AppCommand.prototype.execute = function(options, callback) {
    var self = this;

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    server.listen(options)
    .on('error', function(e) {
        self.phonegap.emit('error', e);
        callback(e);
    })
    .on('log', function(statusCode, url) {
        self.phonegap.emit('log', statusCode, url);
    })
    .on('complete', function(data) {
        callback(null, data);
    });

    self.phonegap.emit('log', 'starting app server...');
};
