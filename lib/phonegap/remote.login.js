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
        return new RemoteLoginCommand(phonegap);
    }
};

function RemoteLoginCommand(phonegap) {
    var self = this;

    // bind PhoneGapBuild "login" event to this instance
    phonegapbuild.on('login', function(options, callback) {
        self.phonegap.emit('login', options, callback);
    });

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
 *   - [`options.username`] {String} is the username.
 *   - [`options.password`] {String} is the password.
 *   - [`options.protocol`] {String} is the protocol, e.g. 'http' or 'https'.
 *   - [`options.host`] {String} is the host address, e.g. 'build.phonegap.com'.
 *   - [`options.port`] {String} is the port, e.g. '80' or '443'.
 *   - [`options.path`] {String} is the api path, e.g. '/api/v1'
 *   - [`options.proxy`] {String} is proxy for requests through, e.g. 'http://myproxy.com'
 *   - `[callback]` {Function} is called after the login.
 *     - `e` {Error} is null on a successful login attempt.
 *     - `api` {Object} the API object defined by phonegap-build-rest
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteLoginCommand.prototype.run = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // try to login; the event will fire if credentials are needed
    phonegapbuild.login(options, function(e, api) {
        if (!e) {
            self.phonegap.emit('log', 'you are logged in');
        }
        callback(e, api);
    });

    return self.phonegap;
};
