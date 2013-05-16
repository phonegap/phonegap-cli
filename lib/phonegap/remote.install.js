/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    phonegapbuild = require('./util/phonegap-build'),
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
 *     - `platforms` {Array} is a list of platforms (limited to 1).
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
    var self = this;

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // require options.data (for now)
    if (!options.data) {
        var e = new Error('missing app data');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // qrcode is url to download app
    var url = 'https://build.phonegap.com' +
              options.data.download[options.platforms[0]] +
              '?auth_token=' + options.data.token;

    // generate qrcode
    self.phonegap.emit('log', 'generating the QRCode...');

    qrcode.generate(url, function(qrcode) {
        self.phonegap.emit('raw', qrcode);
        self.phonegap.emit('log', 'install the app by scanning the QRCode');
        callback(null, options.data);
    });
};
