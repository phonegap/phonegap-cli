/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    recipes = require('../../package.json').recipes,
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new RecipeListCommand(phonegap);
    }
};

function RecipeListCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(RecipeListCommand, Command);

/**
 * List Available Recipes.
 *
 * Lists the recipes available to the user.
 *
 * Options:
 *
 *   - `options` {Object} is currently unused (but required for consistency).
 *   - [`callback`] {Function} is triggered after completion
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object}
 *       - `recipes` {Array} is a list of the recipe names
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

RecipeListCommand.prototype.run = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // collect the recipes
    var data = { recipes: [] };
    for (var key in recipes) {
        var recipe = recipes[key];
        recipe.name = key;
        data.recipes.push(recipe);
    }

    // trigger async callback
    process.nextTick(function() {
        callback(null, data);
    });

    return self.phonegap;
};
