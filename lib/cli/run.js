/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap run <platform>
 *
 * Builds and installs a specific platform.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the app.
 */

module.exports = function(argv, callback) {
    // display help on $ phonegap run
    if (argv._.length <= 1) {
        argv._.unshift('help');
        this.argv(argv, callback);
        return;
    }

    // app data
    var data = { platforms: [argv._[1]] };

    for(var key in argv) {
        if (key !== '_') {
            data[key] = argv[key];
        }
    }

    // run locally or remotely
    phonegap.run(data, function(e, data) {
        callback(e, data);
    });
};
