/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new PlatformUpdateCommand(phonegap);
    }
};

function PlatformUpdateCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(PlatformUpdateCommand, Command);

/**
 * Update a Platform Version.
 *
 * Updates a platform to the current version of PhoneGap.
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

PlatformUpdateCommand.prototype.run = function(options, callback) {
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');

    // options parameters
    callback = callback || function(e) {};

    // update project
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

PlatformUpdateCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];

    // validate parameters
    if (options.platforms.length < 1) {
        var e = new Error('missing a platform to update');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    self.phonegap.emit('log', 'updating ' + platform.human + ' platform...');

    // update the platform
    cordova.platform('update', [ platform.local ], function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        self.phonegap.emit('log', 'successfully update', platform.human, 'platform');
        callback(null);
    });
};
