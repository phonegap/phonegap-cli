/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    phonegapbuild = require('./util/phonegap-build'),
    qrcode = require('qrcode-terminal'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
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
 *     - `platforms` {Array} is a list of platforms (limited to 1).
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RemoteBuildCommand.prototype.init = function(options, callback) {
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
    var self = this;

    // login to get API needed to build remotely
    self.phonegap.remote.login({}, function(e, api) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        var data = {
            api: api,
            platforms: options.platforms
        };

        var build = phonegapbuild.build(data, function(e, data) {
            if (e) {
                self.phonegap.emit('error', e);
                callback(e);
                return;
            }

            self.phonegap.emit('log', 'generating the QRCode...');

            // qrcode is url to download app
            var url = 'https://build.phonegap.com' +
                      data.download[options.platforms[0]] +
                      '?auth_token=' + api.token;

            // generate qrcode
            qrcode.generate(url, function(qrcode) {
                self.phonegap.emit('raw', qrcode);
                self.phonegap.emit('log', 'install the app by scanning the QRCode');
                callback(null, data);
            });
        });

        build.on('compress', function() {
            self.phonegap.emit('log', 'compressing the web app...');
        });

        build.on('upload', function() {
            self.phonegap.emit('log', 'uploading to', 'build.phonegap.com'.underline + '...');
        });

        build.on('build', function() {
            self.phonegap.emit('log', 'waiting for the', data.platforms[0], 'app to build...');
        });
    });
};
