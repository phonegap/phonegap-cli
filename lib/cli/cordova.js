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
    // display help on $ phonegap cordova
    if (argv._.length <= 1) {
        argv._.unshift('help');
        this.argv(argv, callback);
        return;
    }

    // given the command:
    //    $ phonegap cordova run some command --foo=BAR
    // construct the equivalent cordova command:
    //    $ cordova run some command --foo=BAR
    cordovaCommand = Array.prototype.slice.call(process.argv);
    while(cordovaCommand[0] !== 'cordova') {
        cordovaCommand.shift();
    }
    cordovaCommand = cordovaCommand.join(' ');

    // use the local cordova node module
    // later on, we could alter this section to load the global cordova module
    var binPath = path.join(__dirname, '..', '..', 'node_modules', '.bin');
    cordovaCommand = path.join(binPath, cordovaCommand);

    // shell out the command to cordova
    var child = shell.exec(cordovaCommand, { async: true, silent: true }, function(code, output) {
        callback();
    });
    child.stdout.on('data', function(data) {
        phonegap.emit('raw', data);
    });
};
