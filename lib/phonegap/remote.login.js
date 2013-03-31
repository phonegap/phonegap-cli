/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    phonegapbuild = require('./util/phonegap-build'),
    emitter = require('./util/emitter'),
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
 *   {EventEmitter} for chaining events.
 */

RemoteLoginCommand.prototype.init = function(options, callback) {
    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // check if account exists
    config.global.load(function(e, account) {
        if (account && account.token) {
            // login with saved account
            phonegapbuild.login(null, function(e, api) {
                if (e) {
                    emitter.emit('err', e.message);
                }
                callback(e, api);
            });
        }
        else {
            // console output
            emitter.emit('log', 'PhoneGap/Build Login');
            emitter.emit('log', 'Sign up at', 'build.phonegap.com'.underline);
            emitter.emit('warn', 'GitHub accounts are unsupported');

            // request login credentials from handler
            emitter.emit('login', options, function(e, data) {
                // login with provided credentials
                phonegapbuild.login(data, function(e, api) {
                    if (e) {
                        emitter.emit('err', e.message);
                    }
                    else {
                        emitter.emit('log', 'logged in as', data.username);
                    }
                    callback(e, api);
                });
            });
        }
    });

    return emitter;
};
