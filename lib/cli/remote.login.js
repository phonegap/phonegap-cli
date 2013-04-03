/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    console = require('./util/console');

/**
 * $ phonegap remote login [options]
 *
 * Prompts for the username and password.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there is an error.
 *     - `api` {Object} is the phonegap-build-rest API object.
 */

module.exports = function(argv, callback) {
    // login credentials
    var data = {
        username: argv.username || argv.u,
        password: argv.password || argv.p
    };

    phonegap.remote.login(data, function(e, api) {
        callback(e, api);
    });
};

/**
 * Bind login event handler.
 *
 * This event is fired when a username and password are required.
 *
 * Options:
 *
 *   - `data` {Object} describes the known auth data.
       - `username` {String} is the username or undefined.
       - `password` {String} is the password or undefined.
 *   - `callback` {Function} is called with the login credentials.
 *     - `e` {Error} is null unless there was an error.
 *     - `options` {Object}
 *     - `options.username` {String} is the username to authenticate.
 *     - `options.password` {String} is the password to authenticate.
 */

phonegap.on('login', function(data, callback) {
    // console.prompt setup
    var promptOptions = {
        // use provided values
        override: data,

        // prompt properties
        data: {
            properties: {
                username: {
                    required: true,
                    description: 'enter username:'
                },
                password: {
                    hidden: true,
                    required: true,
                    description: 'enter password:'
                }
            }
        }
    };

    // begin prompting
    console.prompt(promptOptions, function(e, result) {
        callback(e, result);
    });
});
