/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    phonegapbuild = require('./util/phonegap-build'),
    config = require('../common/config'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
        return new RemoteLoginCommand(phonegap);
    }
};

function RemoteLoginCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RemoteLoginCommand, Command);

/**
 * Login.
 *
 * Authenticates with PhoneGap Build, saves the token, and return an API object.
 * When the save token exists, the authentication step is skipped.
 *
 * Options:
 *
 *   - `options` {Object} contains the login credentials.
 *   - `[options.username]` {String} is the username.
 *   - `[options.password]` {String} is the password.
 *   - `[callback]` {Function} is called after the login.
 *     - `e` {Error} is null on a successful login attempt.
 *     - `api` {Object} the API object defined by phonegap-build-rest
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteLoginCommand.prototype.init = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // bind PhoneGapBuild "login" event.
    // FIX: should be bound in the constructor
    phonegapbuild.on('login', function(options, callback) {
        self.phonegap.emit('login', options, callback);
    });

    // login
    phonegapbuild.login(options, function(e, api) {
        if (e) {
            self.phonegap.emit('error', e);
        }
        callback(e, api);
    });

    return self.phonegap;
};
