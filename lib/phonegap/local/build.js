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
 *
 * Events:
 *
 *   - `error` is triggered on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is trigger when there is no error.
 */

module.exports = function(options, callback) {
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');

    // options parameters
    callback = callback || function(e) {};

    // event support
    var emitter = new events.EventEmitter();
    emitter.on('error', callback);
    emitter.on('complete', function() {
        callback(null);
    });

    // build project
    process.nextTick(function() {
        execute(options, emitter);
    });

    return emitter;
};

/*!
 * Execute.
 */

var execute = function(options, emitter) {
    options.emitter = emitter;

    // validate parameters
    if (options.platforms.length < 1) {
        options.emitter.emit('error', new Error('missing a platform in options.platform'));
        return;
    }

    // add the platform binaries
    module.exports.addPlatform(options, function(e) {
        if (e) {
            emitter.emit('error', e);
            return;
        }

        options.emitter.emit('log', 'building the', options.platforms[0], 'platform');

        try {
            // build the platform
            cordova.build(options.platforms, function() {
                emitter.emit('complete');
            });
        }
        catch(err) {
            // workaround because cordova-cli throws String and Error objects.
            // CB-2733 has fixed the inconsistencies.
            e = (err instanceof Error) ? err : new Error(err);
            emitter.emit('error', e);
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
 *   - `options.emitter` {EventEmitter} is the process event emitter.
 *   - `callback` {Function} is called after completion.completion.
 *     - `e` {Error} is null on a successful completion.
 */

module.exports.addPlatform = function(options, callback) {
    //// require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');
    if (!options.emitter) throw new Error('missing options.emitter parameter');
    if (!callback) throw new Error('missing callback parameter');

    // path to platform directory
    var platformPath = path.join('.', 'platforms', options.platforms[0]);

    // finish if platform exists
    if (fs.existsSync(platformPath)) {
        callback(null);
        return;
    }

    // emit adding the platform
    options.emitter.emit('log', 'adding the', options.platforms[0], 'platform');

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
        callback(e);
    }
};
