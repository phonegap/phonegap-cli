/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap template search [name]
 *
 * Display a list of available templates.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is null unless there is an error.
 */

module.exports = function(argv, callback) {
    phonegap.template.search({}, function(e, data) {
        callback();
    });
};
