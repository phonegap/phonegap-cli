/*!
 * Module dependencies.
 */
var recipes = require('../../recipes')

/**
 * lists recipes
 *
 */
module.exports = function listRecipes() {
    recipes.forEach(function(recipe) {
        console.log(recipe.name + ' : ' + recipe.description)
    })
}
