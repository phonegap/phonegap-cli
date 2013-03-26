/*!
 * Module dependencies
 */

var cordova = require('cordova'),
    path = require('path'),
    fs = require('fs');

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
 */

module.exports = function(options, callback) {
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');

    // options parameters
    callback = callback || function(e) {};

    // build project
    execute.call(this.phonegap, options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

var execute = function(options, callback) {
    var self = this;

    // validate parameters
    if (options.platforms.length < 1) {
        self.emit('err', 'a platform was not specified');
        callback(new Error('missing a platform in options.platform'));
        return;
    }

    // add the platform binaries
    module.exports.addPlatform.call(self, options, function(e) {
        if (e) {
            self.emit('err', e.message);
            callback(e);
            return;
        }

        try {
            // build the platform
            self.emit('log', 'starting to compile', options.platforms[0]);

            cordova.build(options.platforms, function() {
                self.emit('log', 'successfully compiled', options.platforms[0]);
                callback(null);
            });
        }
        catch(err) {
            // workaround because cordova-cli throws String and Error objects.
            // CB-2733 has fixed the inconsistencies.
            e = (err instanceof Error) ? err : new Error(err);
            self.emit('err', e.message);
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
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');
    if (!callback) throw new Error('missing callback parameter');

    // path to platform directory
    var platformPath = path.join('.', 'platforms', options.platforms[0]),
        self = this;

    // finish if platform exists
    if (fs.existsSync(platformPath)) {
        callback(null);
        return;
    }

    // emit adding the platform
    self.emit('log', 'adding the', options.platforms[0], 'platform');

    try {
        // add the platform
        cordova.platform('add', options.platforms, function() {
            callback(null);
        });
    }
    catch(err) {
        // workaround because cordova-cli throws String and Error objects.
        // CB-2733 has fixed the inconsistencies.
        var e = (err instanceof Error) ? err : new Error(err);
        self.emit('err', e.message);
        callback(e);
    }
};
