/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

/**
 * $ phonegap serve [options]
 *
 * Serves the app on a local web server.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    // options
    var data = {
        port: argv.port || argv.p,
        autoreload: argv.autoreload,
        browser: argv.browser,
        console: argv.console,
        deploy: argv.deploy,
        homepage: argv.homepage,
        localtunnel: argv.localtunnel,
        proxy: !argv.proxy, // build commands expect default of false, but connect-phonegap expects default of true
        push: argv.push,
        refresh: argv.refresh,
        verbose: argv.verbose
    };

    phonegap.serve(data, function(e, server) {
        if (!e) {
            console.log('');
            console.log('ctrl-c to stop the server');
            console.log('');
        }

        callback(e);
    });

    // gracefully exit on ctrl-c
    process.on('SIGINT', function() {
        process.exit();
    });
};
