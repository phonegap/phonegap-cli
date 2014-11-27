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
        var processArgv = Array.prototype.slice.call(argv);
        argv = require('minimist')(argv.slice(2), {
            boolean: [
                'd', 'device',
                'e', 'emulator',
                'd', 'verbose',
                'v', 'version',
                'h', 'help',
                'autoreload',
                'localtunnel'
            ],
            default: {
                'autoreload': true,
                'localtunnel': false
            }
        });

        // add $0 for backward-compatibility for optimist.
        argv.$0 = path.basename(processArgv[1]).replace('.js', '');

        // add original argv command without minimist formatting
        argv.processArgv = processArgv;

        // add -e support to Cordova commands
        if (argv.e) {
            var index = argv.processArgv.indexOf('-e');
            if (index >= 0) {
                argv.processArgv[index] = '--emulator';
                argv.emulator = true;
                argv.e = false;
            }
        }
    }

    // cordova commands should bypass all processing
    if (argv._[0] && argv._[0].match(/cordova/i)) {
        this.cordova(argv, callback);
        return;
    }

    // --version
    if (argv.version || argv.v) {
        this.version(argv, callback);
        return;
    }

    // --verbose
    if (argv.verbose || argv.d) {
        argv.verbose = true;
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

    // execute unknown commands with cordova
    if (command === this) {
        argv.processArgv.splice(2, 0, 'cordova');
        argv._.unshift('cordova');
        this.cordova(argv, callback);
    }
    // execute all other commands with phonegap
    else {
        command.call(this, argv, callback);
    }
};
