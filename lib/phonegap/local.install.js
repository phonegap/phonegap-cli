/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new LocalInstallCommand(phonegap);
    }
};

function LocalInstallCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalInstallCommand, Command);

/**
 * Install a Local App.
 *
 * Install an app from the local system.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `platforms` {Array} is a list of platforms (limited to 1).
 *     - [`device`] {Boolean} is true when only using device.
 *     - [`emulator`] {Boolean} is true when only using emulator.
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

LocalInstallCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // install app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

LocalInstallCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // simplfy callback
    var _callback = function(e) {
        if (e) {
            self.phonegap.emit('error', e);
        }
        callback(e);
    };

    // install app
    if (options.device) {
        cordova.run([ platform.local ], _callback);
    }
    else if (options.emulator) {
        cordovaEmulate(self, platform);
        cordova.emulate([ platform.local ], _callback);
    }
    else {
        // when no target is specified: try device and fallback on emulator
        cordova.run([ platform.local ], function(e) {
            if (e) {
                cordovaEmulate(self, platform);
                cordova.emulate([ platform.local ], _callback);
            }
            else {
                _callback(null);
            }
        });
    }
};

/**
 * Validate the emulate requirements.
 *
 * This can be removed when Xcode 5 replaces ios-sim.
 *
 * Options:
 *
 *   - `self` {Object} is `this` of the calling Command.
 *   - `platform` {Object} is the platform to check.
 */

function cordovaEmulate(self, platform) {
    // warn about missing ios-sim requirement
    if (platform.local === 'ios' && !shell.which('ios-sim')) {
        self.phonegap.emit('warn', 'missing ios-sim');
        self.phonegap.emit('warn', 'install ios-sim from',
                                   'http://github.com/phonegap/ios-sim');
    }
}
