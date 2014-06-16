/**
 * Module dependencies.
 */

var path = require('path'),
    phonegap = require('../main');

/**
 * Parse command-line arguments.
 *
 * Inspects the arguments and calls the appropriate action.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist.argv object.
 *   - `[callback]` {Function} is called on completion.
 */

module.exports = function(argv, callback) {
    // optional callback
    callback = callback || function() {};

    // parse process.argv for easy --flag handling
    // skipped when already parsed
    if (!argv._) {
        argv = require('minimist')(argv.slice(2), {
            boolean: [
                'd', 'device',
                'e', 'emulator',
                'V', 'verbose',
                'v', 'version',
                'h', 'help',
                'autoreload'
            ],
            default: {
                'autoreload': true
            }
        });

        // add $0 for backward-compatibility for optimist.
        argv.$0 = path.basename(process.argv[1]);
    }

    // --version
    if (argv.version || argv.v) {
        this.version(argv, callback);
        return;
    }

    // --verbose
    if (argv.verbose || argv.d) {
        phonegap.mode({ verbose: true });
    }

    // --help
    // --help <command>
    if (argv.help || argv.h) {
        argv._.unshift('help');
    }

    // support <command> help
    if (argv._[argv._.length-1] === 'help' && argv._.length > 1) {
        argv._.pop();
        argv._.unshift('help');
    }

    // no command displays help
    if (!argv._.length) {
        argv._.unshift('help');
    }

    // lookup command to execute
    var command = this;
    for (var i = 0, l = argv._.length; i < l; i++) {
        if (typeof command[argv._[i]] === 'function') {
            command = command[argv._[i]];
        }
        else {
            break;
        }
    }

    // execute command
    if (command === this) {
        this.unknown(argv, callback);
    }
    else {
        command.call(this, argv, callback);
    }
};
