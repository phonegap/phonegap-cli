/*
 * Module dependencies.
 */

var console = require('../console'),
    config = require('../../common/config');

/**
 * Command line login.
 *
 * Prompts for the username.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there is an error.
 *     - `api` {Object} is the phonegap-build-rest API object.
 */

module.exports = function(argv, callback) {
    var self = this;

    // check if account exists
    config.global.load(function(e, account) {
        if (account && account.token) {
            // login with saved account
            self.phonegap.login(null, function(e, api) {
                if (e) {
                    console.error('failed to login:', e.message);
                }

                callback(e, api);
            });
        }
        else {
            // do not prompt for provided --options
            argv.username = argv.username || argv.u;
            argv.password = argv.password || argv.p;

            // display login header before prompt
            if (!argv.username || !argv.password) {
                console.log('login for', 'build.phonegap.com'.underline);
                console.warn('github login is unsupported');
            }

            // console.prompt setup
            var promptOptions = {
                // use provided values
                override: argv,

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
                if (e) {
                    console.log('failed during prompt:', e.message);
                    callback(e);
                    return;
                }

                // login with prompt result
                console.log('logging in...');
                self.phonegap.login(result, function(e, api) {
                    if (e) {
                        console.error('failed to login:', e.message);
                    }
                    else {
                        console.log('logged in as', result.username);
                    }

                    callback(e, api);
                });
            });
        }
    });
};
