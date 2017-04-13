/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    config = require('../common/config'),
    qrcode = require('qrcode-terminal'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new RemoteRunCommand(phonegap);
    }
};

function RemoteRunCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RemoteRunCommand, Command);

/**
 * Run a Remote App.
 *
 * Run is defined as a build and install.
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
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteRunCommand.prototype.run = function(options, callback) {
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

RemoteRunCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // build the app
    self.phonegap.remote.build(options, function(e, data) {
        if (e) {
            callback(e);
            return;
        }

        config.global.load(function(e, configData) {
            if (e) {
                callback(e);
                return;
            }

            // qrcode is url to download app
            var url = 'https://build.phonegap.com' +
                      data.download[platform.remote] +
                      '?auth_token=' + configData.phonegap.token;

            // output url
            self.phonegap.emit('log','url: ' + url);

            // generate qrcode
            self.phonegap.emit('log', 'generating the QRCode...');
            qrcode.generate(url, function(qrcode) {
                self.phonegap.emit('raw', qrcode);
                self.phonegap.emit('log', 'install the app by scanning the QRCode');
                callback(null, data);
            });
        });
    });
};
