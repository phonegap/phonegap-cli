/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap local plugin remove <id>
 *
 * Remove a plugin from the application locally.
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
    if (argv._.length <= 3) {
        argv._.unshift('help');
        this.cli.argv(argv, callback);
        return;
    }

    // plugin data
    var data = { id: [argv._[3]] };

    // remove plugin
    phonegap.local.plugin.remove(data, function(e, data) {
        callback(e, data);
    });
};
