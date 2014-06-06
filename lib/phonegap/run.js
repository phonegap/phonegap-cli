/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova'),
    util = require('util');

/**
 * localization of human readable log messages
 * eventual migration to its own module
 */
var PG_STR = {
    'msgdet' : ['detecting', 'SDK environment...'],
    'useenv' : ['using the', 'environment'],
    'platerr': ['failed to find platform: ','. Insure that ',' is a valid platform supported by the PhoneGap CLI']
};

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new RunCommand(phonegap);
    }
};

function RunCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RunCommand, Command);

/**
 * Runs an App.
 *
 * Automatically detects if local SDK exists.
 *  - true: run application on the local system.
 *  - false: run the application remotely.
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

RunCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // run app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

RunCommand.prototype.execute = function(options, callback) {
    var self = this,
        platform = platforms.names(options.platforms)[0];
    
    if (!platform) {
        var platarg = options.platforms[0];
        self.phonegap.emit('error', {message:PG_STR.platerr[0]+platarg+PG_STR.platerr[1]+ platarg + PG_STR.platerr[2]});
        return; 
    }

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // detect the platform support
    self.phonegap.emit('log', 'detecting', platform.human, 'SDK environment...');

    self.phonegap.cordova.raw.platform.supports('.', platform.local).then(function() {
        // invoke local build
        var env = 'local';
        self.phonegap.emit('log', PG_STR.useenv[0], env, PG_STR.useenv[1]);
        self.phonegap[env].run(options, callback);
    }, function(e) {
        // invoke remote build
        var env = 'remote';
        self.phonegap.emit('log', PG_STR.useenv[0], env, PG_STR.useenv[1]);
        self.phonegap[env].run(options, callback);
    });
};
