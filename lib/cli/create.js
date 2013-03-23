/*!
 * Module dependencies.
 */

var console = require('./util/console'),
    path = require('path');

/**
 * Command line create command.
 *
 * For now, forward to the original PhoneGap Build create.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    var self = this;

    // display help on $ phonegap create
    if (argv._.length <= 1) {
        argv._.unshift('help');
        self.argv(argv, callback);
        return;
    }

    // project info
    var data = {
        path: argv._[1]
    };

    // create the project
    self.phonegap.create(data, function(e) {
        if (e) {
            console.error('failed to create the project:', e.message);
        }
        else {
            console.log('created the project:', path.relative('.', data.path));
        }
    });
};
