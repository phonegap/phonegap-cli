/*!
 * Module dependencies.
 */

var phonegapbuild = require('./util/phonegap-build'),
    emitter = require('./util/emitter');

/**
 * Logout.
 *
 * Logout of PhoneGap/Build.
 *
 * Options:
 *
 *   - `options` {Object} is unused and should be `{}`.
 *   - [`callback`] {Function} is a callback function.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is trigger when there is no error.
 *
 * Returns:
 *
 *   {EventEmitter} for chaining events.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // logout
    phonegapbuild.logout(options, function(e) {
        if (e) {
            emitter.emit('err', e.message);
        }
        else {
            emitter.emit('log', 'logged out of', 'build.phonegap.com'.underline);
        }

        callback(e);
    });

    return emitter;
};
