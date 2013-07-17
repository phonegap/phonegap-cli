/*!
 * Module dependencies.
 */

var console = require('./util/console'),
    util = require('util');

/**
 * $ phonegap noop
 *
 * Outputs that the command-line command is unsupported.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    console.error(util.format(
        "'%s' is not a %s command. See '%s help'",
        argv._.join(' '),
        argv.$0,
        argv.$0
    ));
    callback();
};
