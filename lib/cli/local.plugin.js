/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap local plugin <command>
 *
 * Plugin interface to interact with plugins.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(argv, callback) {
    var self = this;

    // display help when given no command
    if (argv._.length <= 2) {
        argv._.unshift('help');
        self.cli.argv(argv, callback);
        return;
    }

    // command is unknown
    self.cli.unknown(argv, callback);
};
