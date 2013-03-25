/*!
 * Module dependencies
 */

var PhoneGapBuild = require('phonegap-build');

/**
 * Logout.
 *
 * Logout the user by deleting the token key from the config file.
 *
 * Options:
 *
 *   - `args` {Object} is unused and should be `{}`.
 *   - [`callback`] {Function} is a callback function.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is trigger when there is no error.
 */

module.exports = (new PhoneGapBuild()).logout;
