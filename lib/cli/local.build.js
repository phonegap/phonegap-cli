/*!
 * Module dependencies.
 */

var console = require('./console');

/**
 * Command line local build command.
 *
 * Build a specific platform on the local system.
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
        self.parent.argv(argv, callback);
        return;
    }

    // build data
    var data = {
        platforms: [argv._[2]]
    };

    // build the project
    var build = self.phonegap.local.build(data, function(e) {
        if (e) {
            console.error('failed to build the app:', e);
        }
        else {
            console.log('completed build of', data.platforms[0]);
        }

        callback(e);
    });

    build.on('log', function() {
        console.log.apply(this, arguments);
    });
};
