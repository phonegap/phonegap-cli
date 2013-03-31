/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    phonegapbuild = require('./util/phonegap-build'),
    emitter = require('./util/emitter'),
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
 *   {EventEmitter} for chaining events.
 */

RemoteBuildCommand.prototype.init = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // build app
    this.execute(options, callback);

    return emitter;
};

/*!
 * Execute.
 */

RemoteBuildCommand.prototype.execute = function(options, callback) {
    var self = this;

    // login to get API needed to build remotely
    self.phonegap.remote.login({}, function(e, api) {
        if (e) {
            emitter.emit('err', e.message);
            callback(e);
            return;
        }

        var data = {
            api: api,
            platforms: options.platforms
        };

        var build = phonegapbuild.build(data, function(e, data) {
            if (e) {
                emitter.emit('err', e.message);
                callback(e);
                return;
            }

            emitter.emit('log', 'generating the QRCode...');

            // qrcode is url to download app
            var url = 'https://build.phonegap.com' +
                      data.download[options.platforms[0]] +
                      '?auth_token=' + api.token;

            // generate qrcode
            qrcode.generate(url, function(qrcode) {
                emitter.emit('raw', qrcode);
                emitter.emit('log', 'install the app by scanning the QRCode');
                callback(null, data);
            });
        });

        build.on('compress', function() {
            emitter.emit('log', 'compressing the web app...');
        });

        build.on('upload', function() {
            emitter.emit('log', 'uploading to', 'build.phonegap.com'.underline + '...');
        });

        build.on('build', function() {
            emitter.emit('log', 'waiting for the', data.platforms[0], 'app to build...');
        });
    });
};
