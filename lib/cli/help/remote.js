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
    var help = [
        '',
        '  Usage: ' + argv.$0 + ' remote [command]',
        '',
        '  Description:',
        '',
        '    Run commands for cloud-based development with PhoneGap/Build.',
        '',
        '  Examples:',
        '',
        '    $ ' + argv.$0 + ' remote build android',
        ''
    ];

    console.log(help.join('\n'));

    callback(null);
};
