/*!
 * Module dependencies.
 */

var path = require('path'),
    phonegap = require('../main');

/**
 * $ phonegap cordova [[commands] options]
 *
 * Execute an arbitrary Cordova CLI command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    var cordovaCommand = Array.prototype.slice.call(argv.processArgv);

    // given the command:
    //    $ phonegap cordova run some command --foo=BAR
    // construct the equivalent cordova command:
    //    $ cordova run some command --foo=BAR
    while(cordovaCommand[0] !== 'cordova') {
        cordovaCommand.shift();
    }

    // wrap any arguments that contain whitespace in quotations.
    // example: cordova create path/to/my-app --name "Hello World"
    cordovaCommand = cordovaCommand.map(function(command) {
        return (/\s/.test(command)) ? '"' + command + '"' : command;
    });

    // create a string representing the cordova command
    cordovaCommand = cordovaCommand.join(' ');

    phonegap.cordova({
        cmd: cordovaCommand,
        verbose: argv.verbose
    }, callback);
};
