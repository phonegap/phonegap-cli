/**
 * Help command for login.
 *
 * Outputs the usage information for the login command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    var help = [
        '',
        '  Usage: ' + argv.$0 + ' remote login [options]',
        '',
        '  Description:',
        '',
        '    Log into your PhoneGap Build account.',
        '',
        '  Options:',
        '',
        '    -u, --username       your username (email address)',
        '    -p, --password       your password',
        '',
        '  Examples:',
        '',
        '    $ ' + argv.$0 + ' remote login',
        '    $ ' + argv.$0 + ' remote login --username michael@michaelbrooks.ca',
        '    $ ' + argv.$0 + ' remote login --u michael@michaelbrooks.ca',
        ''
    ];

    console.log(help.join('\n'));

    callback(null);
};
