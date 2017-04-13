/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    qrcode = require('qrcode-terminal'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new RemoteInstallCommand(phonegap);
    }
};

function RemoteInstallCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RemoteInstallCommand, Command);

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

RemoteInstallCommand.prototype.run = function(options, callback) {
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

RemoteInstallCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // require options.data (for now)
    if (!options.data) {
        var e = new Error('missing app data');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // url components
    var protocol = options.protocol || 'https:',
        host = options.host || 'build.phonegap.com',
        port = options.port || '443';

    // qrcode is url to download app
    var url = protocol + '//' + host + ':' + port +
              options.data.download[platform.remote] +
              '?auth_token=' + options.data.token;

    // output url
    self.phonegap.emit('log','url: ' + url);
    // generate qrcode
    self.phonegap.emit('log', 'generating the QRCode...');

    qrcode.generate(url, function(qrcode) {
        self.phonegap.emit('raw', qrcode);
        self.phonegap.emit('log', 'install the app by scanning the QRCode');

        // add URL to returned data
        options.data.url = url;

        callback(null, options.data);
    });
};
