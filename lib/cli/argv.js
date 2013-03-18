/**
 * Parse command-line arguments.
 *
 * Inspects the arguments and calls the appropriate action.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist.argv object.
 *   - [`callback`] {Function} is called on completion.
 */

module.exports = function(argv, callback) {
    // optional callback
    callback = callback || function() {};

    // --version
    if (argv.version || argv.v) {
        this.version(argv, callback);
        return;
    }

    // --help
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

    // execute command
    if (typeof this[argv._[0]] === 'function') {
        if (typeof this[argv._[0]][argv._[1]] === 'function') {
            this[argv._[0]][argv._[1]](argv, callback);
        }
        else {
            this[argv._[0]](argv, callback);
        }
    }
    else {
        this.unknown(argv, callback);
    }
};
