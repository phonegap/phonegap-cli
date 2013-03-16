/*!
 * Module dependencies.
 */

/**
 * Remote commands.
 *
 * Groups all of the remote commands under the... remote... command.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    var self = this;

    // display help on $ phonegap-build create
    if (argv._.length <= 1) {
        self.help.remote(argv, callback);
        return;
    }

    // @TODO look up the command to execute
};
