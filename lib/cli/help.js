/**
 * Help command.
 *
 * Outputs the usage information for the command-line.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is null unless there is an error.
 */

module.exports = function(argv, callback) {
    // $ phonegap help <command>
    if (typeof this[argv._[0]][argv._[1]] === 'function') {
        this[argv._[0]][argv._[1]](argv, callback);
    }
    // $ phonegap help
    else {
        var help = [
            '',
            '  Usage: ' + argv.$0 + ' [options] [commands]',
            '',
            '  Synopsis:',
            '',
            '    PhoneGap command-line tool.',
            '',
            '  Commands:',
            '',
            '    create <path>        create a phonegap project',
            '    help [commands]      output usage information',
            '    version              output version number',
            '',
            '  Options:',
            '',
            '    -v, --version        output version number',
            '    -h, --help           output usage information',
            '',
            '  Examples:',
            '',
            '    ' + argv.$0 + ' help create',
            '    ' + argv.$0 + ' create path/to/my-app',
            ''
        ];

        console.log(help.join('\n'));
        callback(null);
    }
};
