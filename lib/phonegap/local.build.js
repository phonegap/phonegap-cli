/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
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

LocalBuildCommand.prototype.run = function(options, callback) {
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
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // validate parameters
    if (options.platforms.length < 1) {
        var e = new Error('missing a platform to build');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // add the platform binaries
    module.exports.addPlatform.call(self, options, function(e) {
        if (e) {
            callback(e);
            return;
        }

        self.phonegap.emit('log', 'compiling ' + platform.human + '...');

        // build the platform
        cordova.build([ platform.local ], function(e) {
            if (e) {
                self.phonegap.emit('error', e);
                callback(e);
                return;
            }

            self.phonegap.emit('log', 'successfully compiled', platform.human, 'app');
            callback(null);
        });
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
    var platform = platforms.names(options.platforms)[0],
        platformPath = path.join('.', 'platforms', platform.local);

    // finish if platform exists
    if (fs.existsSync(platformPath)) {
        callback(null);
        return;
    }

    // emit adding the platform
    self.phonegap.emit('log', 'adding the', platform.human, 'platform...');

    // add the platform
    cordova.platform('add', [ platform.local ], function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        callback(null);
    });
};

var dupeCordovaToGap = function(srcFolder,done) {
    var cordovaFile = path.join(srcFolder, 'cordova.js'),
        phonegapFile = path.join(srcFolder, 'phonegap.js');

    // create phonegap.js
    shell.cp('-f',cordovaFile, phonegapFile);

    done && done();
};

/**
 * Inject phonegap.js into Project.
 *
 * Add compatibility for PhoneGap to Cordova by injecting `phonegap.js`
 * before the build process.
 */

cordova.on('after_prepare', function(data, done) {
    dupeCordovaToGap(data.paths[0],done);
});

// pre_package is a windows-phone build event that is raised before the final app packaging
// this is to allow modification to the www folder of the project.
cordova.on('pre_package',function(data,done){
    dupeCordovaToGap(data.wwwPath,done);
});
