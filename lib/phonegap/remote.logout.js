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
    create: function(phonegap) {
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
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteLogoutCommand.prototype.run = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // logout
    phonegapbuild.logout(options, function(e) {
        callback(e);
    });

    return self.phonegap;
};
