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
        // calculate the width of the name row.
        // the width minus the current name will give us the indentation width
        // to align the names and descriptions
        var maxLength = 0;
        data.recipes.forEach(function(recipe) {
            maxLength = Math.max(maxLength, recipe.name.length);
        });
        maxLength += 4; // space between the longest name and description

        // display all recipes
        data.recipes.forEach(function(recipe) {
            var indent = new Array(maxLength - recipe.name.length).join(' ');
            phonegap.emit('raw', recipe.name + indent + recipe.description);
        });
    });
};
