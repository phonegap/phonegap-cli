/*!
 * Module dependencies.
 */

var config = require('../common/config');

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
 */

module.exports = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // check if account exists
    config.global.load(function(e, account) {
        if (account && account.token) {
            // login with saved account
            self.phonegap.phonegapbuild.login(null, function(e, api) {
                if (e) {
                    self.phonegap.emit('err', e.message);
                }
                callback(e, api);
            });
        }
        else {
            // console output
            self.phonegap.emit('log', 'PhoneGap/Build Login');
            self.phonegap.emit('log', 'Sign up at', 'build.phonegap.com'.underline);
            self.phonegap.emit('warn', 'GitHub accounts are unsupported');

            // request login credentials from handler
            self.phonegap.emit('login', options, function(e, data) {
                // login with provided credentials
                self.phonegap.phonegapbuild.login(data, function(e, api) {
                    if (e) {
                        self.phonegap.emit('err', e.message);
                    }
                    else {
                        self.phonegap.emit('log', 'logged in as', data.username);
                    }
                    callback(e, api);
                });
            });
        }
    });

    return this.phonegap;
};
