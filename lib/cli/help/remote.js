/**
 * Help commmand for remote.
 *
 * Outputs the usage information for the remote command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    // $ phonegap help remote <command>
    if (typeof this[argv._[1]] === 'function' &&
        typeof this[argv._[1]][argv._[2]] === 'function') {
        this[argv._[1]][argv._[2]](argv, callback);
    }
    // $ phonegap help
    else {
        var help = [
            '',
            '  Usage: ' + argv.$0 + ' remote [command]',
            '',
            '  Description:',
            '',
            '    Run commands for cloud-based development with PhoneGap/Build.',
            '',
            '  Commands:',
            '',
            '    login                login to phonegap build',
            '',
            '  Examples:',
            '',
            '    $ ' + argv.$0 + ' remote login',
            '    $ ' + argv.$0 + ' remote build android',
            ''
        ];

        console.log(help.join('\n'));

        callback(null);
    }
};
