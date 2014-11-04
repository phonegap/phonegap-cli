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

    // redirect as a cordova command
    process.argv[2] = 'cordova'; // replace 'local' with 'cordova'
    argv._[0] = 'cordova';
    self.cli.cordova(argv, callback);
};
