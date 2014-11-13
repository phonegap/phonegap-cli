/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap local [command]
 *
 * Groups all of the local commands under the... local... command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    var self = this;

    // display help when given no command
    if (argv._.length <= 1) {
        argv._.unshift('help');
        self.argv(argv, callback);
        return;
    }

    phonegap.emit('warn', 'The command `phonegap local <command>` has been DEPRECATED.');
    phonegap.emit('warn', 'The command has been delegated to `phonegap <command>`.');
    phonegap.emit('warn', 'The command `phonegap local <command>` will soon be removed.');

    // redirect to `$ phonegap <command>` which delegates to a cordova command
    argv.processArgv.splice(2, 1);  // remove the 'local' command
    argv._.shift();                 // remove the 'local' command
    self.cli.argv(argv, callback);
};
