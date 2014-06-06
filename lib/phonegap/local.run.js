/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
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

LocalRunCommand.prototype.run = function(options, callback) {
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

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // build the app
    self.phonegap.local.build(options, function(e) {
        if (e) {
            callback(e);
            return;
        }

        // install the app
        self.phonegap.local.install(options, function(e) {
            callback(e);
        });
    });
};
