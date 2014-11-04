/*!
 * Module dependencies.
 */

var path = require('path'),
    phonegap = require('../main'),
    shell = require('shelljs');

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
    var cordovaCommand = Array.prototype.slice.call(process.argv);

    // given the command:
    //    $ phonegap cordova run some command --foo=BAR
    // construct the equivalent cordova command:
    //    $ cordova run some command --foo=BAR
    while(cordovaCommand[0] !== 'cordova') {
        cordovaCommand.shift();
    }
    cordovaCommand = cordovaCommand.join(' ');

    phonegap.cordova({ cmd: cordovaCommand }, callback);
};
