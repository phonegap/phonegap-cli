/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    emitter = require('./util/emitter'),
    cordova = require('cordova'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
        return new BuildCommand(phonegap);
    }
};

function BuildCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(BuildCommand, Command);

/**
 * Build an App.
 *
 * Automatically detects if local SDK exists.
 *  - true: build application on the local system.
 *  - false: build the application remotely.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `platforms` {Array} is a list of platforms (limited to 1).
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {EventEmitter} for chaining events.
 */

BuildCommand.prototype.init = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // build app
    this.execute(options, callback);

    return emitter;
};

/*!
 * Execute.
 */

BuildCommand.prototype.execute = function(options, callback) {
    var platform = options.platforms[0],
        self = this;

    // detect the platform support
    emitter.emit('log', 'detecting', platform, 'SDK environment...');

    cordova.platform.supports(platform, function(supported) {
        // invoke local or remote build
        var env = (supported) ? 'local' : 'remote';
        emitter.emit('log', 'using the', env, 'environment');
        self.phonegap[env].build(options, callback);
    });
};
