/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    soundwave = require('phonegap-soundwave'),
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
    var self = this;
    
    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    soundwave.serve(options,callback);
    self.phonegap.emit('log', 'starting app server...');
    
    // bind error
    soundwave.on('error', function(e) {
        self.phonegap.emit('error', e);
        callback(e);
    });

    // bind log
    soundwave.on('log', function(msg) {
        self.phonegap.emit('log', msg);
    });
};
