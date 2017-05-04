/*!
 * Module dependencies.
 */
var phonegap = require('../main');

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

    // stop cordova-cli from tracking us!
    cordovaCommand.push("--no-telemetry");
    // append --save by default to phonegap plugin add 
    var pluginCommands = ["add", "remove", "rm"];
    var pluginAlias = ["plugin","plugins"];
    if(cordovaCommand[0] == "cordova" && 
       pluginAlias.indexOf(cordovaCommand[1]) != -1 && 
       cordovaCommand.indexOf("--save") == -1 && cordovaCommand.indexOf("--no-save") == -1 &&
       pluginCommands.indexOf(cordovaCommand[2]) != -1)
    {
        cordovaCommand.push("--save");
    }

    // create a string representing the cordova command
    cordovaCommand = cordovaCommand.join(' ');

    phonegap.cordova({
        cmd: cordovaCommand,
        verbose: argv.verbose
    }, callback);
};
