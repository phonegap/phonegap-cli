/**
 * Help commmand for app.
 *
 * Outputs the usage information for the app command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    var help = [
        '',
        '  Usage: ' + argv.$0 + ' app [options]',
        '',
        '  Description:',
        '',
        '    Servers the app on a local web server.',
        '',
        '    The intended receiver is the PhoneGap App, but any',
        '    browser can consume the content.',
        '',
        '  Options:',
        '',
        '    --port, -p <n>       port for web server (default: 3000)',
        '',
        '  Examples:',
        '',
        '    $ ' + argv.$0 + ' app',
        '    $ ' + argv.$0 + ' app --port 1337',
        ''
    ];

    console.log(help.join('\n'));

    callback(null);
};
