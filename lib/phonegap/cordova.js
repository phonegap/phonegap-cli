/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    path = require('path'),
    shell = require('shelljs'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new CordovaCommand(phonegap);
    }
};

function CordovaCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(CordovaCommand, Command);

/**
 * Execute a Cordova command.
 *
 * Execute an arbitrary Cordova CLI command.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `cmd` {String} is the exact Cordova command to execute.
 *   - [`callback`] {Function} is triggered after executing the command.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

CordovaCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.cmd) throw new Error('requires option.cmd parameter');

    // optional callback
    callback = callback || function() {};

    // validate options
    if (!options.cmd.match(/^cordova/)) {
        throw new Error('options.cmd must execute cordova');
    }

    // create app
    this.execute(options, callback);

   return this.phonegap;
};

/*!
 * Execute.
 */

CordovaCommand.prototype.execute = function(options, callback) {
    var self = this;

    // use the local cordova node module
    // later on, we could alter this section to load the global cordova module
    var binPath = path.join(__dirname, '..', '..', 'node_modules', '.bin'),
        cordovaCommand = path.join(binPath, options.cmd),
        execOptions = { async: true, silent: true };

    // shell out the command to cordova
    var child = shell.exec(cordovaCommand, execOptions, function(code, output) {
        callback();
    });

    child.stdout.on('data', function(data) {
        self.phonegap.emit('raw', data);
    });

    child.stderr.on('data', function(data) {
        self.phonegap.emit('raw', data);
    });
};
