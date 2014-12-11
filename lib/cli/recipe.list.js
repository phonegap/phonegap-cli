/*!
 * Module dependencies.
 */
var path = require('path'),
    list = require('../phonegap/recipe.list');

/**
 * $ phonegap recipe list
 *
 * Lists availabe recipes.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is null unless there is an error.
 */

module.exports = function(argv, callback) {
    list();
    callback(null);
};
