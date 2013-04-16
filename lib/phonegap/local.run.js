/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    cordova = require('cordova'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    init: function(phonegap) {
        return new LocalRunCommand(phonegap);
    }
};

function LocalRunCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalRunCommand, Command);

/**
 * Run a Local App.
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

LocalRunCommand.prototype.init = function(options, callback) {
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

LocalRunCommand.prototype.execute = function(options, callback) {
    var self = this;

    // build the app
    self.phonegap.local.build(options, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        try {
            // FIX: cordova.emulate throws errors that cannot be caught
            // FIX: cordova.emulate may trigger callback twice
            cordova.emulate(options.platforms, function() {
                callback(null);
            });
        }
        catch(e) {
            self.phonegap.emit('error', e);
            callback(e);
        }
    });
};
