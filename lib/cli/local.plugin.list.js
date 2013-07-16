/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap local plugin list
 *
 * List installed plugins.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(argv, callback) {
    // list installed plugins
    phonegap.local.plugin.list({}, function(e, data) {
        callback(e, data);
    });
};
