/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    phonegapbuild = require('./util/phonegap-build'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new RemoteBuildCommand(phonegap);
    }
};

function RemoteBuildCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RemoteBuildCommand, Command);

/**
 * Build an App Remotely.
 *
 * Uses PhoneGap/Build to build the application.
 *
 * Options:
 *
 *   - `options` {Object}
 *   - `options.platforms` {Array} is a list of platforms (limited to 1).
 *   - [`options.protocol`] {String} is the protocol, e.g. 'http' or 'https'.
 *   - [`options.host`] {String} is the host address, e.g. 'build.phonegap.com'.
 *   - [`options.port`] {String} is the port, e.g. '80' or '443'.
 *   - [`options.path`] {String} is the api path, e.g. '/api/v1'
 *   - [`options.proxy`] {String} is proxy for requests through, e.g. 'http://myproxy.com'
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object} data returned by PhoneGap/Build API.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteBuildCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // build app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

RemoteBuildCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // add platforms argument but keep the other options
    options.platforms = [ platform.remote ];

    phonegapbuild.build(options, function(e, data) {
        if (e) {
            callback(e);
            return;
        }

        self.phonegap.emit('log', platform.human, 'build complete');
        callback(null, data);
    });
};
