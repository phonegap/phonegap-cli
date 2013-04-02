/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap remote run <platform>
 *
 * Run will build and install the application.
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
    if (argv._.length <= 2) {
        argv._.unshift('help');
        this.cli.argv(argv, callback);
        return;
    }

    // run data
    var data = {
        platforms: [argv._[2]]
    };

    // run the project
    phonegap.remote.run(data, function(e, data) {
        callback(e, data);
    });
};
