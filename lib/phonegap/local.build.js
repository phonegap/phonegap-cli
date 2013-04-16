/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    cordova = require('cordova'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
        return new LocalBuildCommand(phonegap);
    }
};

function LocalBuildCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalBuildCommand, Command);

/**
 * Build Project Locally.
 *
 * Building a project locally will use the Cordova CLI library to do the
 * heavy lifting. However, the library has a few existing bumps that
 * we will want to smooth out.
 *
 * 1. Adding a platform.
 *   - Cordova requires that a platform is added before it can be built.
 *   - We will abstract the need to add a platform.
 *   - On each build, the platform to be added if it does not exist.
 * 2. Building the platform.
 *   - Cordova will do the heavy lifting here.
 * 3. Deploying a platform.
 *   - Unfortunately, Cordova (sometimes) attempts to install the app to an
 *     emulator or device. It's extremely consistent across platforms.
 *   - To make life better for everyone, this library will inform the user
 *     what is happening.
 *
 * Options:
 *
 *   - `options` {Object}.
 *   - `[options.platforms]` {Array} is a list of platforms to build (limit is 1).
 *   - `[callback]` {Function} is called after completionn
 *     - `e` {Error} is null on a successful completion.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

LocalBuildCommand.prototype.init = function(options, callback) {
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');

    // options parameters
    callback = callback || function(e) {};

    // build project
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

LocalBuildCommand.prototype.execute = function(options, callback) {
    var self = this;

    // validate parameters
    if (options.platforms.length < 1) {
        var e = new Error('missing a platform to build');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // add the platform binaries
    module.exports.addPlatform.call(self, options, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        try {
            self.phonegap.emit('log', 'compiling ' + options.platforms[0] + '...');

            // build the platform
            cordova.build(options.platforms, function() {
                self.phonegap.emit('log', 'successfully compiled', options.platforms[0], 'app');
                callback(null);
            });
        }
        catch(e) {
            self.phonegap.emit('error', e);
            callback(e);
        }
    });
};

/**
 * Add Platform to Project.
 *
 * Cordova requires that a platform is explicitly added to a project before
 * the platform can be built.
 *
 * Options:
 *
 *   - `options` {Object}.
 *   - `options.platforms` {Array} is a list of platforms to add (limited to 1)
 *   - `callback` {Function} is called after completion.completion.
 *     - `e` {Error} is null on a successful completion.
 */

module.exports.addPlatform = function(options, callback) {
    var self = this;

    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');
    if (!callback) throw new Error('missing callback parameter');

    // path to platform directory
    var platformPath = path.join('.', 'platforms', options.platforms[0]);

    // finish if platform exists
    if (fs.existsSync(platformPath)) {
        callback(null);
        return;
    }

    // emit adding the platform
    self.phonegap.emit('log', 'adding the', options.platforms[0], 'platform...');

    try {
        // add the platform
        cordova.platform('add', options.platforms, function() {
            callback(null);
        });
    }
    catch(e) {
        self.phonegap.emit('error', e);
        callback(e);
    }
};
