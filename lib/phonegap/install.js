/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    platforms = require('./util/platform'),
    cordova = require('cordova-lib').cordova;

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
        return new InstallCommand(phonegap);
    }
};

function InstallCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(InstallCommand, Command);

/**
 * Installs an App.
 *
 * Automatically detects if local SDK exists.
 *  - true: install application using the local system.
 *  - false: install the application using remote service.
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

InstallCommand.prototype.run = function(options, callback) {
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

InstallCommand.prototype.execute = function(options, callback) {
    var self = this,
        installed,
        platform = platforms.names(options.platforms)[0];
    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // detect the platform support
    self.phonegap.emit('log', PG_STR.msgdet[0], platform.human, PG_STR.msgdet[1]);
    
    try {
        // will throw if element in options.platform isn't recognized
        installed = project.listPlatforms('.');
        if (!(options.platforms[0] in installed)) {
            cordova.platform('add', options.platforms, null, function(e){
                // invoke local build
                install.apply(self, ['local', options, callback]);
            });
        }
   } catch (e) {
        // invoke remote build
        install.apply(self, ['remote', options, callback]);
    }
};

function install(env, options, callback) {
   this.phonegap.emit('log', PG_STR.useenv[0], env, PG_STR.useenv[1]);
   this.phonegap[env].install(options, callback); 
};
