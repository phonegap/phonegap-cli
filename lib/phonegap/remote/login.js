/*!
 * Module dependencies
 */

var PhoneGapBuild = require('phonegap-build');

/**
 * Login.
 *
 * Authenticates with PhoneGap Build, saves the token, and return an API object.
 * When the save token exists, the authentication step is skipped.
 *
 * Options:
 *
 *   - `options` {Object} contains the login credentials.
 *   - `[options.username]` {String} is the username.
 *   - `[options.password]` {String} is the password.
 *   - `[callback]` {Function} is called after the login.
 *     - `e` {Error} is null on a successful login attempt.
 *     - `api` {Object} the API object defined by phonegap-build-rest
 *
 * Events:
 *
 *   - `error` is triggered on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is trigger when there is no error.
 *     - `api` {Object} is instance of phonegap-build-api object.
 */

module.exports = (new PhoneGapBuild()).login;
