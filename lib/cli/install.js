/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap install <platform>
 *
 * Installs a specific platform.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the app.
 */

module.exports = function(argv, callback) {
    // display help on $ phonegap install
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

    // install locally or remotely
    phonegap.install(data, function(e, data) {
        callback(e, data);
    });
};
