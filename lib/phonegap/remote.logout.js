/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    phonegapbuild = require('./util/phonegap-build'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
        return new RemoteLogoutCommand(phonegap);
    }
};

function RemoteLogoutCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RemoteLogoutCommand, Command);

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
 *   {PhoneGap} for chaining.
 */

RemoteLogoutCommand.prototype.init = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // logout
    phonegapbuild.logout(options, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
        }
        else {
            self.phonegap.emit('log', 'logged out of', 'build.phonegap.com'.underline);
        }

        callback(e);
    });

    return self.phonegap;
};
