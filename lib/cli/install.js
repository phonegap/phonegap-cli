/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap create <path>
 *
 * Create a Cordova-compatible project.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    // display help on $ phonegap create
    if (argv._.length <= 1) {
        argv._.unshift('help');
        this.argv(argv, callback);
        return;
    }

    // delegate to `phonegap run <platform>`
    for(var i = 0, l = argv._.length; i < l; i++) {
        if (argv._[i] === 'install') {
            argv.processArgv[i + 2] = 'run';
            argv._[i] = 'run';
            i = l;
        }
    }

    phonegap.emit('warn', 'The command `phonegap install` has been DEPRECATED.');
    phonegap.emit('warn', 'The command has been delegated to `phonegap run`.');
    phonegap.emit('warn', 'The command will soon be removed.');

    this.argv(argv, callback);
};
