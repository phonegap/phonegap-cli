/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova-lib').cordova,
    util = require('util');


/**
 * localization of human readable log messages
 * eventual migration to its own module
 */
var PG_STR = {
    'msgdet' : ['detecting', 'SDK environment...'],
    'useenv' : ['using the', 'environment']
};

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new BuildCommand(phonegap);
    }
};

function BuildCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(BuildCommand, Command);

/**
 * Build an App.
 *
 * Automatically detects if local SDK exists.
 *  - true: build application on the local system.
 *  - false: build the application remotely.
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

BuildCommand.prototype.run = function(options, callback) {
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

BuildCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0],
        env = '';

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // detect the platform support
    self.phonegap.emit('log', PG_STR.msgdet[0], platform.human, PG_STR.msgdet[1]);

    this.phonegap.cordova.raw.platform.supports('.', platform.local).then(function() {
        // invoke local or remote build
        var env = 'local';
        self.phonegap.emit('log', PG_STR.useenv[0], env, PG_STR.useenv[1]);
        self.phonegap[env].build(options, callback);
    }, function (e) {
        var env = 'remote';
        // emit a non-exiting message to stderr, incase user wants to react to local build failure
        self.phonegap.emit('error', e);
        self.phonegap.emit('log', PG_STR.useenv[0], env, PG_STR.useenv[1]);
        self.phonegap[env].build(options, callback);
    });
};
