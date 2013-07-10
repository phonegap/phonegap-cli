/*!
 * Module dependencies.
 */

var phonegapbuild = require('./util/phonegap-build'),
    Command = require('./util/command'),
    cordova = require('cordova'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new ModeCommand(phonegap);
    }
};

function ModeCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(ModeCommand, Command);

/**
 * Mode configuration.
 *
 * Customize the running mode.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `verbose` {Boolean} is true to enable additional output from dependencies..
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

ModeCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional callback
    callback = callback || function() {};

    // update mode
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

ModeCommand.prototype.execute = function(options, callback) {
    var self = this.phonegap;

    // reset the listeners on the a new PhoneGap instance
    phonegapbuild.removeAllListeners('log');
    phonegapbuild.removeAllListeners('warn');
    phonegapbuild.removeAllListeners('error');
    phonegapbuild.removeAllListeners('raw');
    cordova.removeAllListeners('log');
    cordova.removeAllListeners('warn');

    // map events from PhoneGapBuild to PhoneGap
    phonegapbuild.on('log', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('log');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('warn', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('warn');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('error', function(e) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('error');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('raw', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('raw');
        self.emit.apply(self, args);
    });

    // verbose output includes cordova
    if (options.verbose) {
        cordova.on('log', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('log');
            self.emit.apply(self, args);
        });

        cordova.on('warn', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('log');
            self.emit.apply(self, args);
        });
    }
};
