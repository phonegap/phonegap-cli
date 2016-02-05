/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap remote build <platform>
 *
 * Build a specific platform. Eventually, it should support building multiple
 * platforms.
 *
 * The `phonegap.remote.build()` function will handle login requirements and
 * the login event handler is set with the CLI login function.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(argv, callback) {
    // display help when missing required parameter <platform>
    // $ phonegap remote build
    if (argv._.length <= 2) {
        argv._.unshift('help');
        this.cli.argv(argv, callback);
        return;
    }

    // build data
    var data = {
        platforms: [argv._[2]],
        protocol: argv.protocol,
        host: argv.host,
        port: argv.port,
        path: argv.path,
        proxy: argv.proxy
    };

    // build the project
    phonegap.remote.build(data, function(e, data) {
        callback(e, data);
    });
};
