/*!
 * Module dependencies.
 */

var console = require('./util/console');

/**
 * Unknown command.
 *
 * Outputs that the command-line command is unsupported.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    console.error('unknown command:', argv._[0]);
    callback();
};
