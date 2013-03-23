/*!
 * Module dependencies.
 */

var console = require('./util/console'),
    cordova = require('cordova');

/**
 * Command line build command.
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
    var self = this;

    // display help on $ phonegap build
    if (argv._.length <= 1) {
        argv._.unshift('help');
        self.argv(argv, callback);
        return;
    }

    // detect the platform support
    cordova.platform.supports(argv._[1], function(supported) {
        // invoke local or remote build
        argv._.unshift( (supported) ? 'local' : 'remote' );
        self.argv(argv, callback);
    });
};
