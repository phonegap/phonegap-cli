/*!
 * Module dependencies.
 */

/**
 * $ phonegap local [command]
 *
 * Groups all of the local commands under the... local... command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    var self = this;

    // display help when given no command
    if (argv._.length <= 1) {
        argv._.unshift('help');
        self.argv(argv, callback);
        return;
    }

    // command is unknown
    self.cli.unknown(argv, callback);
};
