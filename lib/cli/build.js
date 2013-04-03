/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap build
 *
 * Build a specific platform. Eventually, it should support building multiple
 * platforms.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(argv, callback) {
    // display help on $ phonegap build
    if (argv._.length <= 1) {
        argv._.unshift('help');
        this.argv(argv, callback);
        return;
    }

    // build data
    var data = {
        platforms: [argv._[1]]
    };

    // build locally or remotely
    phonegap.build(data, function(e, data) {
        callback(e, data);
    });
};
