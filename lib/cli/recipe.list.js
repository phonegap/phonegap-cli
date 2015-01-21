/*!
 * Module dependencies.
 */

var phonegap = require('../main');

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
    phonegap.recipe.list({}, function(e, data) {
        data.recipes.forEach(function(recipe) {
            phonegap.emit('raw', recipe.name + '\t' + recipe.description);
        });
    });
};
