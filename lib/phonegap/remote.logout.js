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
 *   {PhoneGap} instance for chaining.
 */

module.exports = function(options, callback) {
    var self = this.phonegap;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // logout
    self.phonegapbuild.logout(options, function(e) {
        if (e) {
            self.emit('err', e.message);
        }
        else {
            self.emit('log', 'logged out of', 'build.phonegap.com'.underline);
        }

        callback(e);
    });

    return self;
};
