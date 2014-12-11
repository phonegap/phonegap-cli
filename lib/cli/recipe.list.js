/*!
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs');

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
    var recipes = require('../../recipes')

    recipes.forEach(function(recipe) {
        console.log(recipe.name + ' : ' + recipe.desc)
    })
    callback(null);
};
