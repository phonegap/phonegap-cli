/*!
 * Module dependencies.
 */

var emitter = require('./util/emitter'),
    cordova = require('cordova');

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
 *   {PhoneGap} instance for chaining.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // build app
    execute.call(this, options, callback);

    return this;
};

/*!
 * Execute.
 */

var execute = function(options, callback) {
    var platform = options.platforms[0],
        self = this;

    // detect the platform support
    emitter.emit('log', 'detecting', platform, 'SDK environment...');

    cordova.platform.supports(platform, function(supported) {
        // invoke local or remote build
        var env = (supported) ? 'local' : 'remote';
        emitter.emit('log', 'using the', env, 'environment');
        self[env].build(options, callback);
    });
};
